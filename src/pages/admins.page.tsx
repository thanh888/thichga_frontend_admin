'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { AdminsStatusCode } from '@/components/dashboard/admins/admin-status-code';
import { AdminsTable } from '@/components/dashboard/admins/admin-table';
import CreateAdmin from '@/components/dashboard/admins/create-admin.dialog';

export default function AdminsPage(): React.JSX.Element {
  const [openCreate, setOpenCreate] = React.useState(false);

  const [isReload, setIsReload] = React.useState<boolean>(true);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quản lý tài khoản admin</Typography>
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
            Add
          </Button>
        </div>
      </Stack>
      <AdminsStatusCode />
      {/* <AdminsFilters /> */}
      <AdminsTable isReload={isReload} setIsReload={setIsReload} />
      <CreateAdmin
        openCreate={openCreate}
        setOpenCreate={setOpenCreate}
        isReload={isReload}
        setIsReload={setIsReload}
      />
    </Stack>
  );
}
