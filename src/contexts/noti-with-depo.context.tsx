'use client';

import * as React from 'react';
import { DepositByStatusApi } from '@/services/dashboard/deposit-history.api';
import { WithdrawByStatusApi } from '@/services/dashboard/withdraw-history.api';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import { DepositTransactionInterface } from '@/utils/interfaces/deposit-history.interface';
import { WithdrawTransactionInterface } from '@/utils/interfaces/withdraw-history.interface';

import { logger } from '@/lib/default-logger';

export interface DepoWithdrawContextValue {
  withdraws?: WithdrawTransactionInterface[];
  deposits?: DepositTransactionInterface[];
  error: string | null;
  isLoading: boolean;
  checkWithdrawsSession: () => Promise<void>;
  checkDepositsSession: () => Promise<void>;
}

export const DepoWithdrawContext = React.createContext<DepoWithdrawContextValue | undefined>(undefined);

export interface DepoWithdrawProviderProps {
  children: React.ReactNode;
}

export function DepoWithdrawProvider({ children }: DepoWithdrawProviderProps): React.JSX.Element {
  const [withdraws, setWithdraw] = React.useState<WithdrawTransactionInterface[]>([]);
  const [deposits, setDeposit] = React.useState<DepositTransactionInterface[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const checkWithdrawsSession = React.useCallback(async (): Promise<void> => {
    try {
      const response = await WithdrawByStatusApi(`status=${WithdrawStatusEnum.PENDING}&sort=-createdAt`);
      if (response.status === 200) {
        setWithdraw(response.data.docs ?? null);
        setError(null);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      logger.error(err);
      setWithdraw([]);
      setError('Lỗi khi tải yêu cầu rút tiền');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkDepositsSession = React.useCallback(async (): Promise<void> => {
    try {
      const response = await DepositByStatusApi(`status=${WithdrawStatusEnum.PENDING}&sort=-createdAt`);
      if (response.status === 200) {
        setDeposit(response.data.docs ?? null);
        setError(null);
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      logger.error(err);
      setDeposit([]);
      setError('Lỗi khi tải yêu cầu nạp tiền');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    checkWithdrawsSession();
    checkDepositsSession();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      withdraws,
      deposits,
      error,
      isLoading,
      checkWithdrawsSession,
      checkDepositsSession,
    }),
    [withdraws, deposits, error, isLoading, checkWithdrawsSession, checkDepositsSession]
  );

  return <DepoWithdrawContext.Provider value={contextValue}>{children}</DepoWithdrawContext.Provider>;
}

export const useDepoWithdraw = () => {
  const context = React.useContext(DepoWithdrawContext);
  if (!context) {
    throw new Error('useDepoWithdraw must be used within a DepoWithdrawProvider');
  }
  return context;
};
