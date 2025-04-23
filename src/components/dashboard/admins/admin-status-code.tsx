import * as React from 'react';
import { Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import ToggleSwitch from '@/components/checkbox/toggle-switch';

export function AdminsStatusCode(): React.JSX.Element {
  return (
    <Card sx={{ p: 2, flexDirection: 'column', display: 'flex', gap: 1 }}>
      <Typography variant="h6" fontSize={20}>
        Trạng thái mã mời
      </Typography>

      <ToggleSwitch name={'status'} />
      <Button variant="contained" sx={{ width: '200px' }}>
        Cập nhật
      </Button>
    </Card>
  );
}
