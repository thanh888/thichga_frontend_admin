'use client';

import * as React from 'react';
import { uploadImageApi } from '@/services/dashboard/bet-room.api';
import { UpdateSettingApi } from '@/services/dashboard/setting.api';
import { CheckFormDataNull, setFieldError } from '@/utils/functions/default-function';
import { PostInterface } from '@/utils/interfaces/post.interface';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import { SettingContext } from '@/contexts/setting-context';
import SunEditorComponent from '@/components/suneditor/suneditor.customize';

export default function PostPage() {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;

  const checkSettingSession = React.useContext(SettingContext)?.checkSettingSession;

  const [formData, setFormData] = React.useState<PostInterface>({
    title: '',
    content: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<string>('');
  const [formError, setFormError] = React.useState<any>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (!value && ['title', 'content'].includes(name)) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  React.useEffect(() => {
    setFormData({
      title: setting?.post?.title ?? '',
      content: setting?.post?.content ?? '',
      image: setting?.post?.image ?? '',
    });
    if (setting?.bank?.imageQR) {
      setImagePreview(process.env.NEXT_PUBLIC_BASE_API_URL + '/' + setting?.bank?.imageQR);
    }
  }, [setting]);

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
      setFormData((prev) => ({
        ...prev,
        image: '',
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requiredFields = {
      title: formData.title,
      content: formData.content,
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
      const response = await UpdateSettingApi(setting._id, { post: formData });

      if (response.status === 200 || response.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Cập nhật thành công');

        setFile('');
      } else {
        console.error('Failed to save post:', response.statusText);
        toast.error('Cập nhật bài viết thất bại');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Lỗi khi gửi bài viết. Vui lòng thử lại sau.');
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
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 4 },
        maxWidth: '100%',
        margin: '0 auto',
        mt: 4,
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Nội dung thẻ đường dẫn cược
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Nội dung thẻ</InputLabel>
                    <OutlinedInput
                      label="Nội dung thẻ"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={formError?.title ?? false}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {formData.content ? (
                    <SunEditorComponent
                      content={formData.content ?? setting?.post?.content ?? ''}
                      setContent={(value) => {
                        setFormData((prev) => ({ ...prev, content: value }));
                        setFieldError(setFormError, 'content', !value);
                      }}
                    />
                  ) : (
                    <SunEditorComponent
                      content={setting?.post?.content}
                      setContent={(value) => {
                        setFormData((prev) => ({ ...prev, content: value }));
                        setFieldError(setFormError, 'content', !value);
                      }}
                    />
                  )}
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
                    src={imagePreview ?? `process.env.NEXT_PUBLIC_BASE_API_URL/${setting?.bank?.imageQR}`}
                    alt="Preview of the uploaded file"
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
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Button variant="contained" component="label">
                  Ảnh hiển thị
                  <input type="file" accept="image/*" hidden name="image" onChange={handleFileChange} />
                </Button>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {file}
                  </Typography>
                )}
              </FormControl>
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
