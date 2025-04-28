import * as React from 'react';
import { CreateAccount } from '@/services/dashboard/user.api';
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

interface CreateAdminProps {
  openCreate: boolean;
  setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultFormData: UserInterface = {
  username: '',
  password: '',
  role: RoleUsers.ADMIN,
};

export default function CreateAdmin({ openCreate, setOpenCreate, setIsReload }: Readonly<CreateAdminProps>) {
  const [formData, setFormData] = React.useState<UserInterface>({
    username: '',
    password: '',
    role: RoleUsers.ADMIN,
  });

  const [formError, setFormError] = React.useState<any>();

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
    setFormData(defaultFormData);
    setOpenCreate(false);
  };

  const handleSubmit = async () => {
    const isNotNull = CheckFormDataNull(formData, setFormError);

    if (!isNotNull) {
      toast.error('Hãy điền đầy đủ thông tin');
      return;
    }

    try {
      const repose = await CreateAccount(formData);
      if (repose.status === 201 || repose.status === 200) {
        setIsReload(true);
        toast.success('Tạo tài khoản admin thành công');
        handleClose();
      } else toast.error('Tạo tài khoản thất bại');
    } catch (error: any) {
      console.log(error.response?.data?.message);
      if (error.response?.data?.message === 'Referral code is not exist') {
        toast.error('Mã giới thiệu không tồn tại'); // hiện message từ NestJS
      } else if (error.response?.data?.message) {
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
      open={openCreate}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Thêm tài khoản admin
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
                  name="username"
                  error={formError?.username ?? false}
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
                  error={formError?.password ?? false}
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
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
        <Button onClick={handleSubmit} variant="contained" type="submit">
          Tạo tài khoản
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
