import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { SignOutApi } from '@/services/auth/auth.api';
import { WithdrawTransactionInterface } from '@/utils/interfaces/withdraw-history.interface';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { DepoWithdrawContext } from '@/contexts/noti-with-depo.context';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function WithdrawNotification({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const depoWithContext = React.useContext(DepoWithdrawContext);
  const withdraws = depoWithContext?.withdraws;

  const router = useRouter();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">Đơn rút chờ duyệt</Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        {(withdraws?.length ?? 0) > 0 &&
          withdraws?.map((item: WithdrawTransactionInterface) => (
            <MenuItem key={item._id} component={RouterLink} href={paths.dashboard.withdraws} onClick={onClose}>
              {item?.userID?.username}
              <ListItemIcon>{': ' + item?.money}</ListItemIcon>
            </MenuItem>
          ))}
      </MenuList>
    </Popover>
  );
}
