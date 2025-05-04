'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UpdateSettingApi } from '@/services/dashboard/setting.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { SettingContext } from '@/contexts/setting-context';

export default function DepositModePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || ''; // Lấy id từ URL, đảm bảo không bị null

  const navigate = useRouter();

  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [selectMode, setSelectMode] = useState<string>('');

  const handleUpdateDepositMode = async () => {
    try {
      const reponse = await UpdateSettingApi(setting?._id, { deposit_mode: selectMode });
      if (reponse.status === 200 || reponse.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Cập nhật thành công');
      }
    } catch (error) {
      toast.error('Cập nhật thất bại');
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
            <Select label="Chọn chế độ" name="deposit_mode" onChange={handleOnChange}>
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
