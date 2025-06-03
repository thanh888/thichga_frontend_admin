'use client';

import * as React from 'react';
import { CreateBetRoom, CreateOtherRoomApi, uploadImageApi } from '@/services/dashboard/bet-room.api';
import { TypeBetRoomEnum } from '@/utils/enum/type-bet-room.enum';
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
  urlLive: string;
  urlType: string;
  fee: string;
  marquee: string;
  redName: string;
  blueName: string;
  redOdds: string;
  blueOdds: string;
  typeRoom: TypeBetRoomEnum.NORMAL | string;
}

const defaultFormData: RoomeFormData = {
  roomName: '',
  urlLive: '',
  urlType: '',
  fee: '',
  marquee: '',
  redName: '',
  blueName: '',
  redOdds: '',
  blueOdds: '',
  typeRoom: TypeBetRoomEnum.OTHER,
};

export default function CreateOtherRoom({ openCreate, setOpenCreate, setIsReload }: Readonly<CreateRoomProps>) {
  const [formData, setFormData] = React.useState<RoomeFormData>(defaultFormData);
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
      if (
        !value &&
        ['roomName', 'urlLive', 'urlType', 'redName', 'blueName', 'fee', 'marquee', 'redOdds', 'blueOdds'].includes(
          name
        )
      ) {
        setFieldError(setFormError, name, true);
      } else {
        setFieldError(setFormError, name, false);
      }
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setFormError({});
    setOpenCreate(false);
  };

  const handleSubmit = async () => {
    const isNotNull = CheckFormDataNull(formData, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const response = await CreateOtherRoomApi(formData); // Assumed room-specific API
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
        Thêm phòng gà đòn
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
              <FormControl fullWidth>
                <InputLabel>% lãi</InputLabel>
                <OutlinedInput
                  label="% lãi"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  error={formError?.fee ?? false}
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
                  error={formError?.marquee ?? false}
                />
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
                Tỷ lệ mẫu
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tỷ lệ đội đỏ</InputLabel>
                <OutlinedInput
                  label="Tỷ lệ đội đỏ"
                  name="redOdds"
                  value={formData.redOdds}
                  onChange={handleChange}
                  error={formError?.redOdds ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tỷ lệ đội xanh</InputLabel>
                <OutlinedInput
                  label="Tỷ lệ đội xanh"
                  name="blueOdds"
                  value={formData.blueOdds}
                  onChange={handleChange}
                  error={formError?.blueOdds ?? false}
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
