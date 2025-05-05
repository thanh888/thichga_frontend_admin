'use client';

import * as React from 'react';
import { uploadImageApi } from '@/services/dashboard/bet-room.api';
import { AddBannerSettingApi } from '@/services/dashboard/setting.api';
import { Box, Button, FormControl, Grid, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { SettingContext } from '@/contexts/setting-context';
import BannerTable from '@/components/dashboard/banner/table-banner';

export default function BannerPage() {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [banner, setBanner] = React.useState<string>('');
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      try {
        const uploadImage = await uploadImageApi(file);
        if (uploadImage.status === 201) {
          setBanner(uploadImage.data.path);

          toast.success('Upload ảnh thành công');
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Upload ảnh thất bại. Vui lòng thử lại sau.');
      }
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!setting?._id) {
        throw new Error('Setting ID is undefined');
      }
      const response = await AddBannerSettingApi(setting._id, banner);

      if (response.status === 200 || response.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Cập nhật thành công');
        setImagePreview('');
        setBanner('');
      } else {
        console.error('Failed to save bank account:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Clean up preview URL when component unmounts or form resets
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Thêm banner
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Button variant="contained" component="label">
                      Chọn Banner
                      <input type="file" accept="image/*" hidden name="img" onChange={handleFileChange} />
                    </Button>
                    {banner && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected: {banner}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
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
                    alt="Image Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No image uploaded
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" size="large">
              Lưu
            </Button>
          </Box>
        </Box>
      </Paper>
      <BannerTable />
    </>
  );
}
