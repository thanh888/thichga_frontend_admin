'use client';

import * as React from 'react';
import { CreateBetRoom, uploadImageApi } from '@/services/dashboard/bet-room.api';
import { UrlTypeEnum } from '@/utils/enum/url-type.enum';
import { CheckFormDataNull, setFieldError } from '@/utils/functions/default-function';
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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface CreateRoomProps {
  openCreate: boolean;
  setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RoomeFormData {
  roomName: string;
  thumbnail: File | null;
  urlLive: string;
  urlType: string;
  secondsEnding: string;
  fee: string;
  marquee: string;
  chattingJframe: string;
  redName: string;
  blueName: string;
  leftText: string;
  centerText: string;
  rightText: string;
}

const defaultFormData: RoomeFormData = {
  roomName: '',
  thumbnail: null,
  urlLive: '',
  urlType: '',
  secondsEnding: '',
  fee: '',
  marquee: '',
  chattingJframe: '',
  redName: '',
  blueName: '',
  leftText: '',
  centerText: '',
  rightText: '',
};

export default function CreateRoom({ openCreate, setOpenCreate, setIsReload }: Readonly<CreateRoomProps>) {
  const [formData, setFormData] = React.useState<RoomeFormData>(defaultFormData);
  const [formError, setFormError] = React.useState<any>({});
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

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
      if (!value && ['roomName', 'urlLive', 'urlType', 'secondsEnding', 'redName', 'blueName'].includes(name)) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const uploadImage = await uploadImageApi(file);
        if (uploadImage.status === 201) {
          setFormData((prev) => ({
            ...prev,
            thumbnail: uploadImage.data.path,
          }));
          toast.success('upload ảnh thành công');
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        }
      } catch (error) {
        toast.error('upload ảnh thất bại');
      }
    } else {
      setImagePreview(null);
    }
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleClose = () => {
    setFormData(defaultFormData);
    setImagePreview(null);
    setFormError({});
    setOpenCreate(false);
  };

  const handleSubmit = async () => {
    const requiredFields = {
      roomName: formData.roomName,
      urlLive: formData.urlLive,
      urlType: formData.urlType,
      secondsEnding: formData.secondsEnding,
      redName: formData.redName,
      blueName: formData.blueName,
    };
    const isNotNull = CheckFormDataNull(requiredFields, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('roomName', formData.roomName);
      formDataToSend.append('urlLive', formData.urlLive);
      formDataToSend.append('urlType', formData.urlType);
      formDataToSend.append('secondsEnding', formData.secondsEnding);
      formDataToSend.append('fee', formData.fee);
      formDataToSend.append('marquee', formData.marquee);
      formDataToSend.append('chattingJframe', formData.chattingJframe);
      formDataToSend.append('redName', formData.redName);
      formDataToSend.append('blueName', formData.blueName);
      formDataToSend.append('leftText', formData.leftText);
      formDataToSend.append('centerText', formData.centerText);
      formDataToSend.append('rightText', formData.rightText);
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      const response = await CreateBetRoom(formDataToSend); // Assumed room-specific API
      if (response.status === 201 || response.status === 200) {
        setIsReload(true);
        toast.success('Tạo phòng thành công');
        handleClose();
      } else {
        toast.error('Tạo phòng thất bại');
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response?.data?.message === 'Room name is existed') {
        toast.error('Tên phòng đã tồn tại');
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại');
      }
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openCreate}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Thêm phòng
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ width: '100%', py: 4, px: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên phòng</InputLabel>
                <OutlinedInput
                  label="Tên phòng"
                  name="roomName"
                  value={formData.roomName}
                  onChange={handleChange}
                  error={formError?.roomName ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Loại đường dẫn</InputLabel>
                <Select
                  label="Loại đường dẫn"
                  name="urlType"
                  value={formData.urlType}
                  onChange={handleChange}
                  error={formError?.urlType ?? false}
                >
                  <MenuItem value="">Chọn loại</MenuItem>
                  <MenuItem value={UrlTypeEnum.M3U8}>M3U8</MenuItem>
                  <MenuItem value={UrlTypeEnum.IFRAME}>IFRAME</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Đường dẫn live</InputLabel>
                <OutlinedInput
                  label="Đường dẫn live"
                  name="urlLive"
                  value={formData.urlLive}
                  onChange={handleChange}
                  error={formError?.urlLive ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Số giây kết thúc phiên</InputLabel>
                <OutlinedInput
                  label="Số giây kết thúc phiên"
                  name="secondsEnding"
                  type="number"
                  value={formData.secondsEnding}
                  onChange={handleChange}
                  error={formError?.secondsEnding ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>% lãi</InputLabel>
                <OutlinedInput
                  label="% lãi"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Iframe hộp chat</InputLabel>
                <OutlinedInput
                  label="Iframe hộp chat"
                  name="chattingJframe"
                  value={formData.chattingJframe}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Ảnh hiển thị</InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <label htmlFor="thumbnail-upload">
                    <input
                      style={{ display: 'none' }}
                      id="thumbnail-upload"
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
                      alt="Thumbnail Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '8px' }}
                    />
                  </Box>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Đội thi đấu
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên đội đỏ</InputLabel>
                <OutlinedInput
                  label="Tên đội đỏ"
                  name="redName"
                  value={formData.redName}
                  onChange={handleChange}
                  error={formError?.redName ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tên đội xanh</InputLabel>
                <OutlinedInput
                  label="Tên đội xanh"
                  name="blueName"
                  value={formData.blueName}
                  onChange={handleChange}
                  error={formError?.blueName ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Văn bản hiển thị
              </Typography>
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
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          Tạo phòng
        </Button>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
