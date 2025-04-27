'use client';

import * as React from 'react';
import { GetSettingApi } from '@/services/dashboard/setting.api';

import { logger } from '@/lib/default-logger';

export interface SettingContextValue {
  setting: any;
  error: string | null;
  isLoading: boolean;
  checkSettingSession?: () => Promise<void>;
}

export const SettingContext = React.createContext<SettingContextValue | undefined>(undefined);

export interface SettingProviderProps {
  children: React.ReactNode;
}

export function SettingProvider({ children }: Readonly<SettingProviderProps>): React.JSX.Element {
  const [state, setState] = React.useState<{ setting: any; error: string | null; isLoading: boolean }>({
    setting: null,
    error: null,
    isLoading: true,
  });

  const checkSettingSession = React.useCallback(async (): Promise<void> => {
    try {
      const reponse = await GetSettingApi();

      if (reponse.status === 200) {
        setState((prev) => ({ ...prev, setting: reponse.data[0] ?? null, error: null, isLoading: false }));
      } else {
        logger.error('Error');
        setState((prev) => ({ ...prev, setting: null, error: 'Something went wrong', isLoading: false }));
        return;
      }
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, setting: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSettingSession().catch((err: unknown) => {
      logger.error(err);
    });
  }, []);

  const contextValue = React.useMemo(() => ({ ...state, checkSettingSession }), [state, checkSettingSession]);

  return <SettingContext.Provider value={contextValue}>{children}</SettingContext.Provider>;
}

export const SettingConsumer = SettingContext.Consumer;
