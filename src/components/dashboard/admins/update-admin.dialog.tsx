'use client';

import * as React from 'react';
import { UpdateUserById } from '@/services/dashboard/user.api';
import { RoleUsers } from '@/utils/enum/role.enum';
import { CheckFormDataNull, rolesAdmin, setFieldError } from '@/utils/functions/default-function';
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

interface EditAdminProps {
  openEdit: any;
  setOpenEdit: React.Dispatch<React.SetStateAction<any>>;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function EditAdmin({ openEdit, setOpenEdit, setIsReload }: Readonly<EditAdminProps>) {
  const [formData, setFormData] = React.useState<UserInterface>({
    username: '',
    password: '',
    role: '',
  });

  const [formError, setFormError] = React.useState<any>();

  React.useEffect(() => {
    if (openEdit !== null) {
      setFormData({
        username: openEdit?.username,
        role: openEdit?.role,
      });
    }
  }, [openEdit]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      if (!value) {
        setFieldError(setFormError, name, true);
        return;
      }
      setFieldError(setFormError, name, false);
    }
  };

  const handleClose = () => {
    setOpenEdit(null);
  };

  const handleSubmit = async () => {
    const isNotNull = CheckFormDataNull(formData, setFormError);
    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin');
      return;
    }

    try {
      const reponse = await UpdateUserById(openEdit._id, formData);
      if (reponse.status === 200 || reponse.status === 201) {
        setIsReload(true);
        toast.success('Cập nhật thành công');
      }
      handleClose();
    } catch (error: any) {
      if (error.response?.data?.message === 'Username is existed') {
        toast.error('Tên người dùng đã tồn tại'); // hiện message từ NestJS
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
        Sửa tài khoản
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
                <InputLabel>Tên đăng nhập</InputLabel>
                <OutlinedInput
                  label="Tên đăng nhập"
                  error={formError?.username ?? false}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Mật khẩu</InputLabel>
                <OutlinedInput
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {/* <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mã mời</InputLabel>
                <OutlinedInput
                  label="Mã mời"
                  name="code"
                  value={formData.referral_receiver_id}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid> */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chức vụ</InputLabel>
                <Select label="Chức vụ" name="role" value={formData.role} onChange={handleChange}>
                  {rolesAdmin.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          Cập nhật
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
