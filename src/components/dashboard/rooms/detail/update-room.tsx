'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  TextareaAutosize,
  Typography,
} from '@mui/material';

interface RoomeFormData {
  name: string;
  file: File | null;
  vidUrl: string;
  vidCategory: string;
  countdown: string;
  feePercentage: string;
  marquee: string;
  role: string;
  chatBox: string;
  sessionStatus: string;
  betStatus: string;
  nameOfA: string;
  nameOfB: string;
  leftText: string;
  centerText: string;
  rightText: string;
  created_at: string;
}

// Styled TextareaAutosize to match OutlinedInput
const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minHeight: '80px',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  resize: 'vertical',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    outline: `2px solid ${theme.palette.primary.main}`,
  },
  '&:hover': {
    borderColor: theme.palette.text.primary,
  },
}));

// Styled Hidden Input for file
const HiddenInput = styled('input')({
  display: 'none',
});

export default function EditRoom() {
  const params = useParams<{ id: string }>();
  const id = params?.id || ''; // Lấy id từ URL, đảm bảo không bị null

  const navigate = useRouter();

  const [formData, setFormData] = React.useState<RoomeFormData | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string>('');

  // Giả lập API lấy dữ liệu phòng
  const fetchRoomData = async (roomId: string): Promise<RoomeFormData> => {
    // Thay bằng API thực tế của bạn
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: `Phòng ${roomId}`,
          file: null,
          vidUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          vidCategory: 'IFRAME',
          countdown: '300',
          feePercentage: '5',
          marquee: 'Chào mừng đến với phòng cược!',
          role: 'P2PBETTING',
          chatBox: '<iframe src="chat-url"></iframe>',
          sessionStatus: 'OPEN',
          betStatus: 'OPEN',
          nameOfA: 'Đội Đỏ',
          nameOfB: 'Đội Xanh',
          leftText: 'Trái',
          centerText: 'Giữa',
          rightText: 'Phải',
          created_at: new Date().toISOString(),
        });
      }, 500);
    });
  };

  // Lấy dữ liệu phòng khi component mount
  React.useEffect(() => {
    if (id) {
      fetchRoomData(id).then((data) => {
        setFormData(data);
        if (data.file) {
          const previewUrl = URL.createObjectURL(data.file);
          setImagePreview(previewUrl);
          setFileName(data.file.name);
        }
      });
    }
  }, [id]);

  // Handle text, number, and select inputs
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
    }
  };

  // Handle file input and generate image preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (formData) {
      setFormData((prev) => ({
        ...prev!,
        file,
      }));
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setFileName(file.name);
      } else {
        setImagePreview(null);
        setFileName('');
      }
    }
  };

  // Clean up image preview URL on component unmount or file change
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Giả lập API cập nhật phòng
  const updateRoom = async (updatedRoom: RoomeFormData) => {
    // Thay bằng API thực tế của bạn
    console.log('Room updated:', updatedRoom);
    return true;
  };

  const handleSubmit = async () => {
    if (formData) {
      const updatedRoom = {
        ...formData,
        created_at: formData.created_at, // Giữ nguyên created_at
      };
      const success = await updateRoom(updatedRoom);
      if (success) {
        navigate.push('/rooms'); // Chuyển hướng về danh sách phòng
      }
    }
  };

  const handleCancel = () => {
    navigate.push('/rooms'); // Chuyển hướng về danh sách phòng
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  // Render video preview based on vidCategory
  const renderVideoPreview = () => {
    if (!formData?.vidUrl || !formData?.vidCategory) return null;

    if (formData.vidCategory === 'M3U8') {
      return (
        <video controls src={formData.vidUrl} style={{ width: '100%', maxHeight: '200px', marginTop: '8px' }}>
          Your browser does not support the video tag.
        </video>
      );
    } else if (formData.vidCategory === 'IFRAME') {
      const embedUrl =
        formData.vidUrl.includes('youtube.com') || formData.vidUrl.includes('youtu.be')
          ? getYouTubeEmbedUrl(formData.vidUrl)
          : formData.vidUrl;
      return (
        <Box sx={{ position: 'relative', paddingTop: '56.25%', marginBottom: '16px' }}>
          <iframe
            src={embedUrl}
            title="Video Preview"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      );
    }
    return null;
  };

  if (!formData) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box sx={{ width: '100%', pt: 1, pb: 4, px: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin phòng
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderVideoPreview()}
          <FormControl fullWidth>
            <InputLabel shrink>Đường dẫn live</InputLabel>
            <StyledTextarea name="vidUrl" value={formData.vidUrl} onChange={handleChange} aria-label="Đường dẫn live" />
            <FormControl fullWidth required sx={{ mt: 2 }}>
              <InputLabel>Loại đường dẫn</InputLabel>
              <Select label="Loại đường dẫn" name="vidCategory" value={formData.vidCategory} onChange={handleChange}>
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="M3U8">M3U8</MenuItem>
                <MenuItem value="IFRAME">IFRAME</MenuItem>
              </Select>
            </FormControl>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth required>
                <InputLabel>Tên phòng</InputLabel>
                <OutlinedInput label="Tên phòng" name="name" value={formData.name} onChange={handleChange} />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel shrink>Iframe hộp chat</InputLabel>
                <StyledTextarea
                  minRows={1}
                  name="chatBox"
                  value={formData.chatBox}
                  onChange={handleChange}
                  aria-label="Iframe hộp chat"
                />
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel shrink>Ảnh hiển thị</InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <label htmlFor="file-upload">
                    <HiddenInput id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
                    <Button variant="contained" component="span">
                      Chọn ảnh
                    </Button>
                  </label>
                  {fileName && (
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {fileName}
                    </Typography>
                  )}
                </Box>
                {imagePreview && (
                  <Box mt={2}>
                    <Typography variant="caption">Xem trước:</Typography>
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px' }}
                    />
                  </Box>
                )}
              </FormControl>
            </Grid>

            {/*============ Section: Session Settings */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Số giây kết thúc phiên</InputLabel>
                <OutlinedInput
                  label="Số giây kết thúc phiên"
                  name="countdown"
                  type="number"
                  value={formData.countdown}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>% lãi</InputLabel>
                <OutlinedInput
                  label="% lãi"
                  name="feePercentage"
                  value={formData.feePercentage}
                  onChange={handleChange}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>

            {/* Section: Display Text */}
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Dòng chữ chạy (marquee)</InputLabel>
                <OutlinedInput
                  label="Dòng chữ chạy (marquee)"
                  name="marquee"
                  value={formData.marquee}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Dòng text trái video</InputLabel>
                <OutlinedInput
                  label="Dòng text trái video"
                  name="leftText"
                  value={formData.leftText}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Dòng text giữa video</InputLabel>
                <OutlinedInput
                  label="Dòng text giữa video"
                  name="centerText"
                  value={formData.centerText}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Dòng text cuối video</InputLabel>
                <OutlinedInput
                  label="Dòng text cuối video"
                  name="rightText"
                  value={formData.rightText}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {/* Section: Teams */}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên đội đỏ</InputLabel>
                <OutlinedInput label="Tên đội đỏ" name="nameOfA" value={formData.nameOfA} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên đội xanh</InputLabel>
                <OutlinedInput label="Tên đội xanh" name="nameOfB" value={formData.nameOfB} onChange={handleChange} />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
            <Button onClick={handleSubmit} variant="contained">
              Cập nhật
            </Button>
            <Button onClick={handleCancel} variant="outlined">
              Reset
            </Button>
          </Box>
          <Box
            sx={{
              width: '100%',
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              textAlign: 'right',
              justifyContent: 'center',
            }}
          >
            <Button onClick={handleSubmit} variant="contained">
              Mở/Đóng phiên
            </Button>
            <Button onClick={handleCancel} variant="outlined">
              Mở/Đóng cược
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
