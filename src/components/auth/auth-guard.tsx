'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      logger.debug('[AuthGuard]: Still loading user data');
      return;
    }

    if (error) {
      logger.error('[AuthGuard]: Error fetching user data', error);
      setIsChecking(false);
      router.replace(paths.auth.signIn);
      return;
    }

    if (!user || !user._id || !user.username) {
      logger.debug('[AuthGuard]: User does not exist or is invalid, redirecting to sign-in');
      router.replace(paths.auth.signIn);
      return;
    }

    logger.debug('[AuthGuard]: User exists and is valid', user);
    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch((err) => {
      logger.error('[AuthGuard]: Error in checkPermissions', err);
      setIsChecking(false);
      router.replace(paths.auth.signIn);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    logger.debug('[AuthGuard]: Rendering null due to error, redirecting to sign-in');
    router.replace(paths.auth.signIn);
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
