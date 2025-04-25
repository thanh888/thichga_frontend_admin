'use client';

import * as React from 'react';
import { Box, Button, FormControl, Grid, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';

import SunEditorComponent from '@/components/suneditor/suneditor.customize';

interface PostFormData {
  img: string;
  sub_title: string;
  content: string;
}

export default function PostPage() {
  const [formData, setFormData] = React.useState<PostFormData>({
    img: '',
    sub_title: '',
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
      img: file ? file.name : '', // Store file name as string
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
    // Replace with actual logic (e.g., send formData to API)
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({
      img: '',
      sub_title: '',
      content: '',
    });
    setImagePreview(null);
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
                    <InputLabel>Sub Title</InputLabel>
                    <OutlinedInput
                      label="Nội dung thẻ"
                      name="sub_title"
                      value={formData.sub_title}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Button variant="contained" component="label">
                      Upload Banner
                      <input type="file" accept="image/*" hidden name="img" onChange={handleFileChange} />
                    </Button>
                    {formData.img && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected: {formData.img}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <SunEditorComponent
                    content={formData.content}
                    setContent={(value) => {
                      setFormData((prev) => ({ ...prev, content: value }));
                    }}
                  />
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
              Submit Post
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
