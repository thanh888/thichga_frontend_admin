'use client';

import React, { useEffect, useState } from 'react';
import { createParamsApi, getParamsApi, UpdateParamsApi } from '@/services/dashboard/param-setting.api';
import { setFieldError } from '@/utils/functions/default-function';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

export default function Page() {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (paramSetting) {
        const response = await UpdateParamsApi(formData);
        if (response.status === 200 || response.status === 201) {
          toast.success('Thành công');
        }
      } else {
        const response = await createParamsApi(formData);
        if (response.status === 200 || response.status === 201) {
          toast.success('Thành công');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [formError, setFormError] = React.useState<any>({});
  const [formData, setFormData] = React.useState<any>({
    userOnline: '',
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name && formData) {
      setFormData((prev: any) => ({
        ...prev!,
        [name]: value,
      }));
      if (!value && ['userOnline'].includes(name)) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  const [paramSetting, setParamSetting] = useState<any>();

  const getParamSetting = async () => {
    try {
      const response = await getParamsApi();
      if (response.status === 200 || response.status === 201) {
        setParamSetting(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getParamSetting();
  }, []);
  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        margin: '0 auto',
        mt: 4,
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Chỉnh sửa
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Số người tham gia</InputLabel>
                <OutlinedInput
                  label="Số tài khoản"
                  name="userOnline"
                  value={formData?.userOnline ?? 0}
                  onChange={handleChange}
                  error={formError?.userOnline ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type="submit" variant="contained" size="large">
                Cập nhật
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
