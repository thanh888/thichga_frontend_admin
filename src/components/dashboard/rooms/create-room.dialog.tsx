import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  TextareaAutosize,
  Typography,
} from '@mui/material';

interface CreateRoomeProps {
  openCreate: boolean;
  setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate?: (newRoom: RoomeFormData) => void;
}

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

export default function CreateRoome({ openCreate, setOpenCreate, onCreate }: Readonly<CreateRoomeProps>) {
  const [formData, setFormData] = React.useState<RoomeFormData>({
    name: '',
    file: null,
    vidUrl: '',
    vidCategory: '',
    countdown: '',
    feePercentage: '',
    marquee: '',
    role: '',
    chatBox: '',
    sessionStatus: '',
    betStatus: '',
    nameOfA: '',
    nameOfB: '',
    leftText: '',
    centerText: '',
    rightText: '',
    created_at: '',
  });
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  // Handle text, number, and select inputs
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
    }
  };

  // Handle file input and generate image preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file,
    }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
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

  const handleClose = () => {
    setFormData({
      name: '',
      file: null,
      vidUrl: '',
      vidCategory: '',
      countdown: '',
      feePercentage: '',
      marquee: '',
      role: '',
      chatBox: '',
      sessionStatus: '',
      betStatus: '',
      nameOfA: '',
      nameOfB: '',
      leftText: '',
      centerText: '',
      rightText: '',
      created_at: '',
    });
    setImagePreview(null);
    setOpenCreate(false);
  };

  const handleSubmit = () => {
    const newRoom = {
      ...formData,
      created_at: new Date().toISOString(),
    };
    console.log('Form submitted:', newRoom);
    if (onCreate) {
      onCreate(newRoom);
    }
    handleClose();
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
    if (!formData.vidUrl || !formData.vidCategory) return null;

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
        <Box sx={{ position: 'relative', paddingTop: '56.25%', marginTop: '8px' }}>
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

  return (
    <Dialog open={openCreate} onClose={handleClose} aria-labelledby="dialog-title" maxWidth="lg" fullWidth>
      <DialogTitle id="dialog-title">Thêm phòng</DialogTitle>
      <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box sx={{ py: 2, px: 2 }}>
          <Grid container spacing={3}>
            {/* Section: Basic Info */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên phòng</InputLabel>
                <OutlinedInput label="Tên phòng" name="name" value={formData.name} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại phòng</InputLabel>
                <Select label="Loại phòng" name="role" value={formData.role} onChange={handleChange}>
                  <MenuItem value="">Chọn loại phòng</MenuItem>
                  <MenuItem value="P2PBETTING">Phòng cược đối kháng</MenuItem>
                  <MenuItem value="BOOKMAKERBETTING">Phòng cược truyền thống</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Section: Media */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Media
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
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
                    <input
                      style={{ display: 'none' }}
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button variant="contained" component="span">
                      Chọn ảnh
                    </Button>
                  </label>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Đường dẫn live</InputLabel>
                <StyledTextarea
                  name="vidUrl"
                  value={formData.vidUrl}
                  onChange={handleChange}
                  aria-label="Đường dẫn live"
                />
                <FormControl fullWidth required sx={{ mt: 2 }}>
                  <InputLabel>Loại đường dẫn</InputLabel>
                  <Select
                    label="Loại đường dẫn"
                    name="vidCategory"
                    value={formData.vidCategory}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Chọn loại</MenuItem>
                    <MenuItem value="M3U8">M3U8</MenuItem>
                    <MenuItem value="IFRAME">IFRAME</MenuItem>
                  </Select>
                </FormControl>
                {renderVideoPreview()}
              </FormControl>
            </Grid>

            {/* Section: Session Settings */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Cài đặt phiên
              </Typography>
            </Grid>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Trạng thái phiên</InputLabel>
                <Select
                  label="Trạng thái phiên"
                  name="sessionStatus"
                  value={formData.sessionStatus}
                  onChange={handleChange}
                >
                  <MenuItem value="">Chọn trạng thái</MenuItem>
                  <MenuItem value="OPEN">Mở phiên</MenuItem>
                  <MenuItem value="CLOSE">Đóng phiên</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Trạng thái cược</InputLabel>
                <Select label="Trạng thái cược" name="betStatus" value={formData.betStatus} onChange={handleChange}>
                  <MenuItem value="">Chọn trạng thái</MenuItem>
                  <MenuItem value="OPEN">Mở cược</MenuItem>
                  <MenuItem value="CLOSE">Đóng cược</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Section: Display Text */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Văn bản hiển thị
              </Typography>
            </Grid>
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

            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Đội thi đấu
              </Typography>
            </Grid>
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
