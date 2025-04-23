'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { AdminsStatusCode } from '@/components/dashboard/admins/admin-status-code';
import { AdminFormData, AdminsTable } from '@/components/dashboard/admins/admin-table';
import { AdminsFilters } from '@/components/dashboard/admins/admins-filters';
import CreateAdmin from '@/components/dashboard/admins/create-admin.dialog';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const admins: AdminFormData[] = [
  {
    id: '1',
    username: 'admin01',
    code: 'INV12345',
    role: 'ADMIN',
  },
  {
    id: '2',
    username: 'manager01',
    code: 'INV23456',
    role: 'PAYMENT_MANAGER',
  },
  {
    id: '3',
    username: 'staff01',
    code: 'INV34567',
    role: 'ROOM_MANAGER',
  },
  {
    id: '4',
    username: 'support01',
    code: 'INV45678',
    role: 'PAYMENT_MANAGER',
  },
];

export default function AdminsPage(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [openCreate, setOpenCreate] = React.useState(false);

  const paginatedCustomers = applyPagination(admins, page, rowsPerPage);

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
      <AdminsTable count={paginatedCustomers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />
      <CreateAdmin openCreate={openCreate} setOpenCreate={setOpenCreate} />
    </Stack>
  );
}

function applyPagination(rows: AdminFormData[], page: number, rowsPerPage: number): AdminFormData[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
