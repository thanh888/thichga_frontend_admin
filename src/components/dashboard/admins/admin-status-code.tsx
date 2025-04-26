'use client';

import * as React from 'react';
import { UpdateSettingApi } from '@/services/dashboard/setting.api';
import { Alert, Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';

import { SettingContext } from '@/contexts/setting-context';
import ToggleSwitch from '@/components/checkbox/toggle-switch';

export function AdminsStatusCode(): React.JSX.Element {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [referralCodeEnabled, setReferralCodeEnabled] = React.useState<boolean>(setting?.referralCodeEnabled ?? false);

  const handleUpdateDepositMode = async () => {
    console.log(setting);
    try {
      const reponse = await UpdateSettingApi(setting?._id, { referralCodeEnabled });
      if (reponse.status === 200 || reponse.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        <Alert severity="success">Cập nhật thành công</Alert>;
      }
    } catch (error) {
      <Alert severity="error">Cập nhật thất bại</Alert>;
    }
  };
  return (
    <Card sx={{ p: 2, flexDirection: 'column', display: 'flex', gap: 1 }}>
      <Typography variant="h6" fontSize={20}>
        Trạng thái mã mời
      </Typography>

      <ToggleSwitch name={'referralCodeEnabled'} checked={referralCodeEnabled} setChecked={setReferralCodeEnabled} />
      <Button variant="contained" sx={{ width: '200px' }} onClick={handleUpdateDepositMode}>
        Cập nhật
      </Button>
    </Card>
  );
}
