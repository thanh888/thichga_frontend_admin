'use client';

import React from 'react';
import { uploadImageApi } from '@/services/dashboard/bet-room.api';
import { createGameApi } from '@/services/dashboard/game.api';
import { StatusGame } from '@/utils/enum/status-game.enum';
import { CheckFormDataNull, setFieldError } from '@/utils/functions/default-function';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

// Placeholder API functions (replace with actual APIs)

export interface CreateGameDto {
  name: string;
  image?: string;
  description?: string;
  status?: StatusGame;
}

export default function CreateGameComponent({
  setIsReload,
}: {
  setIsReload: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [formData, setFormData] = React.useState<CreateGameDto>({
    name: '',
    image: '',
    description: '',
    status: StatusGame.UN_ACTIVE,
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
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (!value && name === 'name') {
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
          setFormData((prev) => ({
            ...prev,
            image: uploadImage.data.path,
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
      name: formData.name,
      description: formData.description,
    };
    const isNotNull = CheckFormDataNull(requiredFields, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!formData.image) {
      toast.warning('Chọn hình ảnh');
      return;
    }

    try {
      const response = await createGameApi(formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('Tạo trò chơi thành công');
        setFormData({ name: '', image: '', description: '', status: StatusGame.UN_ACTIVE });
        setImagePreview(null);
        setFile('');
        setIsReload((prev) => prev + 1);
      } else {
        console.error('Failed to create game:', response);
        toast.error('Tạo trò chơi thất bại');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Tạo Trò Chơi
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Tên trò chơi</InputLabel>
                  <OutlinedInput
                    label="Tên trò chơi"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={formError?.name ?? false}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Mô tả</InputLabel>
                  <OutlinedInput
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    error={formError?.description ?? false}
                    rows={4}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select label="Trạng thái" name="status" value={formData.status} onChange={handleChange}>
                    {Object.values(StatusGame).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Button variant="contained" component="label">
                    Tải lên ảnh
                    <input type="file" accept="image/*" hidden name="image" onChange={handleFileChange} />
                  </Button>
                  {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Đã chọn: {file}
                    </Typography>
                  )}
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
                  alt="Xem trước trò chơi"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có ảnh
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" size="large">
            Tạo
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
