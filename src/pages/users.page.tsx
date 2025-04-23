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
import CreateUser from '@/components/dashboard/users/create-user.dialog';
import { UserFormData, UsersTable } from '@/components/dashboard/users/user-table';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const users: UserFormData[] = [
  {
    id: '1',
    username: 'john_doe',
    status: 'active',
    referrer: 'admin_01',
    created_at: '2025-04-01T10:30:00Z',
  },
  {
    id: '2',
    username: 'jane_smith',
    status: 'inactive',
    referrer: 'john_doe',
    created_at: '2025-04-02T12:45:00Z',
  },
  {
    id: '3',
    username: 'alex_nguyen',
    status: 'active',
    referrer: 'admin_02',
    created_at: '2025-04-03T09:15:00Z',
  },
  {
    id: '4',
    username: 'maria_garcia',
    status: 'active',
    referrer: 'alex_nguyen',
    created_at: '2025-04-05T14:10:00Z',
  },
  {
    id: '5',
    username: 'tom_hardy',
    status: 'pending',
    referrer: 'jane_smith',
    created_at: '2025-04-06T16:20:00Z',
  },
];

export default function UsersPage(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  const [openCreate, setOpenCreate] = React.useState(false);

  const paginatedCustomers = applyPagination(users, page, rowsPerPage);

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
      <UsersTable count={paginatedCustomers.length} page={page} rows={paginatedCustomers} rowsPerPage={rowsPerPage} />
      <CreateUser openCreate={openCreate} setOpenCreate={setOpenCreate} />
    </Stack>
  );
}

function applyPagination(rows: UserFormData[], page: number, rowsPerPage: number): UserFormData[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
