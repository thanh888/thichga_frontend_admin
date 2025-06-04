'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import CreateUser from '@/components/dashboard/users/create-user.dialog';
import { UsersTable } from '@/components/dashboard/users/user-table';

export default function UsersPage(): React.JSX.Element {
  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [isReload, setIsReload] = React.useState<boolean>(true);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quản lý người dùng</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={() => setOpenCreate(!openCreate)}
            variant="contained"
          >
            Thêm người dùng
          </Button>
        </div>
      </Stack>
      <UsersTable isReload={isReload} setIsReload={setIsReload} />
      <CreateUser openCreate={openCreate} setOpenCreate={setOpenCreate} isReload={isReload} setIsReload={setIsReload} />
    </Stack>
  );
}
