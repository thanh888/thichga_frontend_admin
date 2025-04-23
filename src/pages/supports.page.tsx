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
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Interface cho dữ liệu liên hệ
interface ContactData {
  phone: string;
  facebook: string;
  telegram: string;
  messenger: string;
  zalo: string;
  marquee: string;
}

// Dữ liệu mẫu ban đầu
const initialContactData: ContactData = {
  phone: '+84 123 456 789',
  facebook: 'https://facebook.com/support',
  telegram: 'https://t.me/support',
  messenger: 'https://m.me/support',
  zalo: 'https://zalo.me/support',
  marquee: 'Liên hệ chúng tôi để được hỗ trợ 24/7!',
};

// Định nghĩa cấu trúc hiển thị
interface ContactField {
  id: keyof ContactData;
  label: string;
}

const contactFields: ContactField[] = [
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'messenger', label: 'Messenger' },
  { id: 'zalo', label: 'Zalo' },
  { id: 'marquee', label: 'Thông báo chạy' },
];

// Dialog tùy chỉnh
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface EditContactDialogProps {
  open: boolean;
  onClose: () => void;
  contactData: ContactData;
  onSave: (data: ContactData) => void;
}

function EditContactDialog({ open, onClose, contactData, onSave }: Readonly<EditContactDialogProps>) {
  const [formData, setFormData] = React.useState<ContactData>(contactData);

  React.useEffect(() => {
    setFormData(contactData);
  }, [contactData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="edit-contact-dialog-title" open={open} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }} id="edit-contact-dialog-title">
        Chỉnh sửa thông tin liên hệ
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Số điện thoại</InputLabel>
                <OutlinedInput label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Facebook</InputLabel>
                <OutlinedInput label="Facebook" name="facebook" value={formData.facebook} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Telegram</InputLabel>
                <OutlinedInput label="Telegram" name="telegram" value={formData.telegram} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Messenger</InputLabel>
                <OutlinedInput label="Messenger" name="messenger" value={formData.messenger} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Zalo</InputLabel>
                <OutlinedInput label="Zalo" name="zalo" value={formData.zalo} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Thông báo chạy</InputLabel>
                <OutlinedInput label="Thông báo chạy" name="marquee" value={formData.marquee} onChange={handleChange} />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

export default function SupportContact() {
  const [contactData, setContactData] = React.useState<ContactData>(initialContactData);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveContact = (data: ContactData) => {
    setContactData(data);
    // Thay bằng logic thực tế (ví dụ: gọi API để lưu dữ liệu)
    console.log('Contact data saved:', data);
  };

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        margin: '0 auto',
        mt: 4,
      }}
    >
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Thông tin liên hệ hỗ trợ
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {contactFields.map((field) => (
            <Box
              key={field.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1,
                borderBottom: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 'bold' }}>
                {field.label}:
              </Typography>
              {field.id === 'marquee' ? (
                <Box
                  sx={{
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    animation: 'marquee 10s linear infinite',
                    '@keyframes marquee': {
                      '0%': { transform: 'translateX(100%)' },
                      '100%': { transform: 'translateX(-100%)' },
                    },
                  }}
                >
                  <Typography variant="body1">{contactData[field.id]}</Typography>
                </Box>
              ) : (
                <Typography variant="body1">{contactData[field.id]}</Typography>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleOpenDialog}>
            Chỉnh sửa
          </Button>
        </Box>
      </Paper>
      <EditContactDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contactData={contactData}
        onSave={handleSaveContact}
      />
    </Box>
  );
}
