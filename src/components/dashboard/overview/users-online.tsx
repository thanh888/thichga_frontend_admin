import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export interface UserActiveProps {
  sx?: SxProps;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

export function UsersOnline({ sx, value, setValue }: UserActiveProps): React.JSX.Element {
  const baseValue = Number(value) || 0;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 đến +3
        const next = prev + delta;
        return next < 0 ? 0 : next;
      });
    }, 5000); // 5 giây thay đổi một lần

    return () => clearInterval(interval);
  }, [setValue]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Người dùng đang online
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: '#7CFC00', height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
