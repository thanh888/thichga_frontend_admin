'use client';

import { log } from 'node:console';

import * as React from 'react';
import type { Metadata } from 'next';
import { useParams } from 'next/navigation';
import { getUserById } from '@/services/dashboard/user.api';
import { UserInterface } from '@/utils/interfaces/user.interface';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import UserHitoryDepositsTable from '@/components/dashboard/users/history-depostit.table';
import UserWithdrawTable from '@/components/dashboard/users/history-withdraw.table';

export const metadata = { title: `Nạp tiền | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function UserWithDrawDepositPage(): React.JSX.Element {
  const params = useParams();
  const user_id = params?.user_id?.toString();
  const [userCreate, setUserCreate] = React.useState<UserInterface>();

  const getUser = async () => {
    if (!user_id) {
      return;
    }
    try {
      const response = await getUserById(user_id);
      if (response.status === 200 || response.status === 201) {
        setUserCreate(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (user_id) {
      getUser();
    }
  }, [user_id]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Nạp rút người dùng: {userCreate?.username}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {user_id && <UserHitoryDepositsTable user_id={user_id} />}
      {user_id && <UserWithdrawTable user_id={user_id} />}
    </Stack>
  );
}
