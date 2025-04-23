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

interface CreateAdminProps {
  openCreate: boolean;
  setOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

// Interface cho dữ liệu form
interface AdminFormData {
  username: string;
  password: string;
  code: string;
  role: string;
}

export default function CreateAdmin({ openCreate, setOpenCreate }: Readonly<CreateAdminProps>) {
  const [formData, setFormData] = React.useState<AdminFormData>({
    username: '',
    password: '',
    code: '',
    role: '',
  });

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
    setOpenCreate(false);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    handleClose();
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
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Mã mời</InputLabel>
                <OutlinedInput label="Mã mời" name="code" value={formData.code} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Chức vụ</InputLabel>
                <Select label="Chức vụ" name="role" value={formData.role} onChange={handleChange}>
                  {states.map((option) => (
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
          Tạo tài khoản
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

// Dữ liệu chọn chức vụ
const states = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'PAYMENT_MANAGER', label: 'Nhân viên quản lý nạp rút' },
  { value: 'ROOM_MANAGER', label: 'Nhân viên quản lý phòng' },
] as const;
