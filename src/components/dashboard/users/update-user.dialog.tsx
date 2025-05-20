'use client';

import * as React from 'react';
import { UpdateUserById } from '@/services/dashboard/user.api';
import { UserStatus } from '@/utils/enum/user-status.enum';
import { CheckFormDataNull, listUserStatuss, setFieldError } from '@/utils/functions/default-function';
import { UserInterface } from '@/utils/interfaces/user.interface';
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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
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

// Custom styled OutlinedInput for disabled fields
const DisabledInput = styled(OutlinedInput)(({ theme }) => ({
  '& .MuiInputBase-input.Mui-disabled': {
    color: theme.palette.grey[700], // Darker color for disabled text
    WebkitTextFillColor: theme.palette.grey[700],
    backgroundColor: theme.palette.grey[200], // Slightly darker background
  },
  '& .MuiInputLabel-root.Mui-disabled': {
    color: theme.palette.grey[600], // Darker label color for disabled fields
  },
}));

// Custom styled Select to fix label overlap and improve readability
const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    paddingTop: theme.spacing(2), // Add padding to prevent label overlap
    paddingBottom: theme.spacing(1),
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 8px) scale(1)', // Adjust label position
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)', // Adjust shrink position
    },
  },
}));

interface EditUserProps {
  openEdit: any;
  setOpenEdit: React.Dispatch<React.SetStateAction<any>>;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
  listReferralBys: any[];
}

const defaultFormData: UserInterface = {
  username: '',
  password: '',
  email: '',
  phone: '',
  fullname: '',
  pin: '',
  money: 0,
  status: '',
  referral_receiver_id: '',
};

export default function EditUser({ openEdit, setOpenEdit, setIsReload, listReferralBys }: Readonly<EditUserProps>) {
  const [formData, setFormData] = React.useState<UserInterface>(defaultFormData);
  const [formError, setFormError] = React.useState<any>();

  React.useEffect(() => {
    if (openEdit !== null) {
      setFormData({
        username: openEdit?.username ?? '',
        email: openEdit?.email ?? '',
        phone: openEdit?.phone ?? '',
        fullname: openEdit?.fullName ?? '',
        pin: openEdit?.pin ?? '',
        money: openEdit?.money ?? '',
        status: openEdit?.status ?? UserStatus.ACTIVE,
        referral_receiver_id: openEdit?.referral_receiver_id?._id ?? '',
      });
    }
  }, [openEdit]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string | any>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (!value && ['username'].includes(name)) {
        setFieldError(setFormError, name, true);
        return;
      }
      setFieldError(setFormError, name, false);
    }
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setOpenEdit(null);
  };

  const handleSubmit = async () => {
    const isNotNull = CheckFormDataNull(
      {
        username: formData.username,
      },
      setFormError
    );

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const response = await UpdateUserById(openEdit._id, formData);
      if (response.status === 200 || response.status === 201) {
        setIsReload(true);
        toast.success('Cập nhật tài khoản thành công');
        handleClose();
      } else {
        toast.error('Cập nhật tài khoản thất bại');
      }
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response?.data?.message === 'Username is existed') {
        toast.error('Tên người dùng đã tồn tại');
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại');
      }
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={openEdit}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Quản lý tài khoản
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
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>TÊN ĐĂNG NHẬP</InputLabel>
                <OutlinedInput
                  label="TÊN ĐĂNG NHẬP"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={formError?.username ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>MẬT KHẨU</InputLabel>
                <OutlinedInput
                  label="MẬT KHẨU"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>EMAIL</InputLabel>
                <OutlinedInput
                  label="EMAIL"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={formError?.email ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>SDT</InputLabel>
                <OutlinedInput
                  label="SDT"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={formError?.phone ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>HỌ VÀ TÊN</InputLabel>
                <OutlinedInput
                  label="HỌ VÀ TÊN"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  error={formError?.fullname ?? false}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>MÃ PIN</InputLabel>
                <OutlinedInput label="MÃ PIN" name="pin" value={formData.pin} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>SỐ DƯ</InputLabel>
                <DisabledInput label="SỐ DƯ" name="money" value={formData.money} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>NGƯỜI GIỚI THIỆU</InputLabel>
                <Select
                  label="NGƯỜI GIỚI THIỆU"
                  name="referral_receiver_id"
                  value={formData.referral_receiver_id}
                  onChange={handleChange}
                  // displayEmpty
                >
                  <MenuItem selected value="">
                    Không có nguồn giới thiệu
                  </MenuItem>
                  {listReferralBys?.map((item, index) => (
                    <MenuItem key={+index} value={item?._id}>
                      {item?.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>ĐỊA CHỈ IP ĐĂNG NHẬP LẦN CUỐI</InputLabel>
                <DisabledInput
                  label="ĐỊA CHỈ IP ĐĂNG NHẬP LẦN CUỐI"
                  name="ipv6"
                  value={openEdit?.ipv6}
                  onChange={handleChange}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>LẦN ĐĂNG NHẬP CUỐI CÙNG</InputLabel>
                <DisabledInput
                  label="LẦN ĐĂNG NHẬP CUỐI CÙNG"
                  name="last_login_at"
                  value={openEdit?.last_login_at}
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>TRẠNG THÁI TÀI KHOẢN</InputLabel>
                <Select
                  label="TRẠNG THÁI TÀI KHOẢN"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  error={formError?.status ?? false}
                >
                  {listUserStatuss.map((status, index) => (
                    <MenuItem key={+index} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>NGÀY TẠO</InputLabel>
                <DisabledInput label="NGÀY TẠO" name="createdAt" value={openEdit?.createdAt} disabled />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#4caf50' }}>
          Cập nhật
        </Button>
        <Button onClick={handleClose} variant="outlined">
          CANCEL
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
