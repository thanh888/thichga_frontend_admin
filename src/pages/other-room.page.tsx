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
import CreateOtherRoom from '@/components/dashboard/other-room/create-other-room.dialog';
import { OtherRoomsTable } from '@/components/dashboard/other-room/other-room-table';

export const metadata = { title: `Gà đòn | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function OtherRoomPage(): React.JSX.Element {
  const [openCreate, setOpenCreate] = React.useState(false);
  const [isReload, setIsReload] = React.useState(false);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Quản lý phòng cược gà đòn</Typography>
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
            Tạo phòng
          </Button>
        </div>
      </Stack>
      <OtherRoomsTable isReload={isReload} setIsReload={setIsReload} />
      <CreateOtherRoom openCreate={openCreate} setOpenCreate={setOpenCreate} setIsReload={setIsReload} />
    </Stack>
  );
}
