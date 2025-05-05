'use client';

import * as React from 'react';
import { uploadImageApi } from '@/services/dashboard/bet-room.api';
import { UpdateSettingApi } from '@/services/dashboard/setting.api';
import { CheckFormDataNull, setFieldError } from '@/utils/functions/default-function';
import { BankInteface } from '@/utils/interfaces/bank.interface';
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

import { SettingContext } from '@/contexts/setting-context';

export default function BankPageBankPage() {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [formData, setFormData] = React.useState<BankInteface>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    imageQR: '',
    branch: '',
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<string>('');

  const [formError, setFormError] = React.useState<any>({});

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name && formData) {
      setFormData((prev) => ({
        ...prev!,
        [name]: value,
      }));
      if (!value && ['bankName', 'accountNumber', 'accountName', 'branch', 'transferContents'].includes(name)) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      try {
        const uploadImage = await uploadImageApi(file);
        if (uploadImage.status === 201) {
          setFormData((prev: any) => ({
            ...prev,
            imageQR: uploadImage.data.path,
          }));
          toast.success('Upload ảnh thành công');
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
          setFile(file.name);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Upload ảnh thất bại. Vui lòng thử lại sau.');
      }
    } else {
      setImagePreview(null);
      setFile('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requiredFields = {
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      branch: formData.branch,
    };
    const isNotNull = CheckFormDataNull(requiredFields, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (!setting?._id) {
        throw new Error('Setting ID is undefined');
      }
      const response = await UpdateSettingApi(setting._id, { bank: formData });

      if (response.status === 200 || response.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Cập nhật thành công');

        setFile('');
      } else {
        console.error('Failed to save bank account:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  React.useEffect(() => {
    setFormData({
      accountName: setting?.bank?.accountName ?? '',
      bankName: setting?.bank?.bankName ?? '',
      accountNumber: setting?.bank?.accountNumber ?? '',
      branch: setting?.bank?.branch ?? '',
      imageQR: setting?.bank?.imageQR ?? '',
      transferContent: setting?.bank?.transferContent ?? '',
    });
    if (setting?.bank?.imageQR) {
      setImagePreview('http://localhost:5000/' + setting?.bank?.imageQR);
    }
  }, [setting]);

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
          Tài khoản ngân hàng
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Tên ngân hàng</InputLabel>
                    <OutlinedInput
                      label="Tên ngân hàng"
                      name="bankName"
                      value={formData.bankName ?? setting?.bank?.bankName}
                      onChange={handleChange}
                      error={formError?.bankName ?? false}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Số tài khoản</InputLabel>
                    <OutlinedInput
                      label="Số tài khoản"
                      name="accountNumber"
                      value={formData.accountNumber ?? setting?.bank?.accountNumber}
                      onChange={handleChange}
                      error={formError?.accountNumber ?? false}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Tên chủ tài khoản</InputLabel>
                    <OutlinedInput
                      label="Tên chủ tài khoản"
                      name="accountName"
                      value={formData.accountName ?? setting?.bank?.accountName}
                      onChange={handleChange}
                      error={formError?.accountName ?? false}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Button variant="contained" component="label">
                      Tải lên mã QR
                      <input type="file" accept="image/*" hidden name="imageQR" onChange={handleFileChange} />
                    </Button>
                    {file && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Đã chọn: {file}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Chi nhánh</InputLabel>
                    <OutlinedInput
                      label="Chi nhánh"
                      name="branch"
                      value={formData.branch}
                      error={formError?.branch ?? false}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel>Nội dung chuyển tiền</InputLabel>
                    <OutlinedInput
                      label="Nội dung chuyển tiền"
                      name="transferContent"
                      value={formData.transferContent}
                      onChange={handleChange}
                      error={formError?.transferContent ?? false}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview ?? `http://localhost:5000/${setting?.bank?.imageQR}`}
                    alt="QR Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có mã QR
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large">
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
