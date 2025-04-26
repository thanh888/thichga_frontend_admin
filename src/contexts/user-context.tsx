'use client';

import * as React from 'react';
import { getAccoutUserApi } from '@/services/auth/auth.api';

import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: any;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: Readonly<UserProviderProps>): React.JSX.Element {
  const [state, setState] = React.useState<{ user: any; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const reponse = await getAccoutUserApi();

      if (reponse.status === 200) {
        setState((prev) => ({ ...prev, user: reponse.data ?? null, error: null, isLoading: false }));
      } else {
        logger.error(reponse?.message);
        setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
        return;
      }
    } catch (err) {
      logger.error(err);
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  const contextValue = React.useMemo(() => ({ ...state, checkSession }), [state, checkSession]);

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;
