'use client';

import * as React from 'react';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';

interface BankAccountFormData {
  bank_name: string;
  number_account: string;
  name_account: string;
  image_qr: File | null;
  branch: string;
  content: string;
}

export default function BankPageBankPage() {
  const [formData, setFormData] = React.useState<BankAccountFormData>({
    bank_name: '',
    number_account: '',
    name_account: '',
    image_qr: null,
    branch: '',
    content: '',
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image_qr: file,
    }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Thay bằng logic thực tế (ví dụ: gửi formData lên API)
    console.log('Form submitted:', formData);
    // Reset form sau khi submit
    setFormData({
      bank_name: '',
      number_account: '',
      name_account: '',
      image_qr: null,
      branch: '',
      content: '',
    });
    setImagePreview(null);
  };

  // Dọn dẹp URL preview khi component unmount hoặc khi reset form
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
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Số tài khoản</InputLabel>
                    <OutlinedInput
                      label="Số tài khoản"
                      name="number_account"
                      value={formData.number_account}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Tên chủ tài khoản</InputLabel>
                    <OutlinedInput
                      label="Tên chủ tài khoản"
                      name="name_account"
                      value={formData.name_account}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Button variant="contained" component="label">
                      Tải lên mã QR
                      <input type="file" accept="image/*" hidden name="image_qr" onChange={handleFileChange} />
                    </Button>
                    {formData.image_qr && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Đã chọn: {formData.image_qr.name}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Chi nhánh</InputLabel>
                    <OutlinedInput label="Chi nhánh" name="branch" value={formData.branch} onChange={handleChange} />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label="Nội dung"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      variant="outlined"
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
                    src={imagePreview}
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
              Thêm tài khoản
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
