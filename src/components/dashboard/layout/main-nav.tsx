'use client';

import * as React from 'react';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

import { DepoWithdrawContext } from '@/contexts/noti-with-depo.context';
import { usePopover } from '@/hooks/use-popover';

import { DepositNotification } from './deposit-noti';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { WithdrawNotification } from './withdraw-noti';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();
  const withdrawsPopover = usePopover<HTMLDivElement>();
  const depositPopover = usePopover<HTMLDivElement>();

  const depoWithContext = React.useContext(DepoWithdrawContext);
  const deposits = depoWithContext?.deposits;
  const withdraws = depoWithContext?.withdraws;

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="TB Nạp" onClick={depositPopover.handleOpen} ref={depositPopover.anchorRef}>
              <Stack direction="column" alignItems="center" sx={{ position: 'relative' }}>
                {(deposits?.length ?? 0) > 0 && (
                  <Badge
                    badgeContent={4}
                    sx={{ position: 'absolute', top: 0, left: 0 }}
                    color="success"
                    variant="dot"
                  ></Badge>
                )}
                Nạp
              </Stack>
            </Tooltip>
            <Tooltip title="TB Rút" onClick={withdrawsPopover.handleOpen} ref={withdrawsPopover.anchorRef}>
              <Stack direction="column" alignItems="center" sx={{ position: 'relative' }}>
                {(withdraws?.length ?? 0) > 0 && (
                  <Badge
                    badgeContent={4}
                    sx={{ position: 'absolute', top: 0, left: 0 }}
                    color="success"
                    variant="dot"
                  ></Badge>
                )}
                Rút
              </Stack>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <DepositNotification
        anchorEl={depositPopover.anchorRef.current}
        onClose={depositPopover.handleClose}
        open={depositPopover.open}
      />
      <WithdrawNotification
        anchorEl={withdrawsPopover.anchorRef.current}
        onClose={withdrawsPopover.handleClose}
        open={withdrawsPopover.open}
      />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
