'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { DepoWithdrawProvider } from '@/contexts/noti-with-depo.context';
import { SettingProvider } from '@/contexts/setting-context';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <SettingProvider>
        <DepoWithdrawProvider>
          <GlobalStyles
            styles={{
              body: {
                '--MainNav-height': '56px',
                '--MainNav-zIndex': 1000,
                '--SideNav-width': '280px',
                '--SideNav-zIndex': 1100,
                '--MobileNav-width': '320px',
                '--MobileNav-zIndex': 1100,
              },
            }}
          />
          <Box
            sx={{
              bgcolor: 'var(--mui-palette-background-default)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minHeight: '100%',
            }}
          >
            <SideNav />
            <Box
              sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}
            >
              <MainNav />
              <main>
                <Container maxWidth="xl" sx={{ py: '40px' }}>
                  {children}
                </Container>
              </main>
            </Box>
          </Box>
        </DepoWithdrawProvider>
      </SettingProvider>
    </AuthGuard>
  );
}
