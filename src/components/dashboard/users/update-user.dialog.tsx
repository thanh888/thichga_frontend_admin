'use client';

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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface EditAdminProps {
  openEdit: any;
  setOpenEdit: React.Dispatch<React.SetStateAction<any>>;
}

// Interface for form data based on the image
interface UserFormData {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  pin: string;
  balance: string;
  ipAddress: string;
  lastLogin: string;
  status: string;
  createdAt: string;
}

export default function EditUser({ openEdit, setOpenEdit }: Readonly<EditAdminProps>) {
  const [formData, setFormData] = React.useState<UserFormData>({
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    pin: '',
    balance: '',
    ipAddress: '',
    lastLogin: '',
    status: 'Hoạt động', // Default value as seen in the image
    createdAt: '',
  });

  React.useEffect(() => {
    if (openEdit !== null) {
      setFormData({
        username: openEdit?.username,
        password: openEdit?.password,
        email: openEdit?.email,
        phone: openEdit?.phone,
        fullName: openEdit?.fullName,
        pin: openEdit?.pin,
        balance: openEdit?.balance,
        ipAddress: openEdit?.ipAddress,
        lastLogin: openEdit?.lastLogin,
        status: openEdit?.status,
        createdAt: openEdit?.createdAt,
      });
    }
  }, [openEdit]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleClose = () => {
    setOpenEdit(null);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    handleClose();
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
            {/* Username */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>TÊN ĐĂNG NHẬP</InputLabel>
                <OutlinedInput
                  label="TÊN ĐĂNG NHẬP"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {/* Password */}
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
            {/* Email */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>EMAIL</InputLabel>
                <OutlinedInput label="EMAIL" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
            </Grid>
            {/* Phone */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>SDT</InputLabel>
                <OutlinedInput label="SDT" name="phone" value={formData.phone} onChange={handleChange} />
              </FormControl>
            </Grid>
            {/* Full Name */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>HỌ VÀ TÊN</InputLabel>
                <OutlinedInput label="HỌ VÀ TÊN" name="fullName" value={formData.fullName} onChange={handleChange} />
              </FormControl>
            </Grid>
            {/* PIN */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>MÃ PIN</InputLabel>
                <OutlinedInput label="MÃ PIN" name="pin" value={formData.pin} onChange={handleChange} />
              </FormControl>
            </Grid>
            {/* Balance */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>SỐ TÀI KHOẢN</InputLabel>
                <OutlinedInput
                  label="SỐ TÀI KHOẢN"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  disabled
                />
              </FormControl>
            </Grid>
            {/* Source - Select with placeholder "Không có nguồn giới thiệu" */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>NGƯỜI GIỚI THIỆU</InputLabel>
                <Select label="NGƯỜI GIỚI THIỆU" name="source" onChange={handleChange} displayEmpty>
                  {/* Add more options if needed */}
                </Select>
              </FormControl>
            </Grid>
            {/* IP Address */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>BIA CHỈ IP ĐANG NHẬP LẦN CUỐI</InputLabel>
                <OutlinedInput
                  label="ĐỊA CHỈ IP ĐANG NHẬP LẦN CUỐI"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  disabled
                />
              </FormControl>
            </Grid>
            {/* Last Login */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>LẦN ĐĂNG NHẬP CUỐI CÙNG</InputLabel>
                <OutlinedInput
                  label="LẦN ĐĂNG NHẬP CUỐI CÙNG"
                  name="lastLogin"
                  value={formData.lastLogin}
                  onChange={handleChange}
                  disabled
                />
              </FormControl>
            </Grid>
            {/* Status */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>TRẠNG THÁI TÀI KHOẢN</InputLabel>
                <Select label="TRẠNG THÁI TÀI KHOẢN" name="status" value={formData.status} onChange={handleChange}>
                  <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                  <MenuItem value="Khóa">Khóa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Created At */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>NGÀY TẠO</InputLabel>
                <OutlinedInput
                  label="NGÀY TẠO"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleChange}
                  disabled
                />
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
