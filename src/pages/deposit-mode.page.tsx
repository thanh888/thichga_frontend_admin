'use client';

import React, { useState } from 'react';
import { UpdateSettingApi } from '@/services/dashboard/setting.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { SettingContext } from '@/contexts/setting-context';

export default function DepositModePage() {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [selectMode, setSelectMode] = useState<string>(setting?.deposit_mode ?? '');

  const handleUpdateDepositMode = async () => {
    try {
      if (!setting?._id) {
        throw new Error('Setting ID is undefined');
      }
      const reponse = await UpdateSettingApi(setting._id, { deposit_mode: selectMode });
      if (reponse.status === 200 || reponse.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Cập nhật thành công');
      }
    } catch (error) {
      toast.error('Cập nhật thất bại');
      console.log(error);
    }
  };
  const handleOnChange = (event: any) => {
    setSelectMode(event.target.value);
  };

  return (
    <Box sx={{ width: '100%', py: 2, px: 4, borderRadius: 2, boxShadow: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Cài đặt Chế độ nạp tiền
      </Typography>
      <Grid container spacing={3} marginTop={1}>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Chọn chế độ
            </InputLabel>
            <Select
              label="Chọn chế độ"
              name="deposit_mode"
              onChange={handleOnChange}
              value={selectMode ?? setting?.deposit_mode}
            >
              <MenuItem value={DepositModeEnum.AUTO}>Tự động</MenuItem>
              <MenuItem value={DepositModeEnum.MANUAL}>Thủ công</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
        <Button variant="contained" onClick={handleUpdateDepositMode}>
          Cập nhật
        </Button>
      </Box>
    </Box>
  );
}
