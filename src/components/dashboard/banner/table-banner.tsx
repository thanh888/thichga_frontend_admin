'use client';

import * as React from 'react';
import { DeleteBannerSettingApi } from '@/services/dashboard/setting.api';
// Assumed API for deleting banners
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

import { SettingContext } from '@/contexts/setting-context';

// Định nghĩa interface cho dữ liệu bảng
interface BannerFormData {
  image_url: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BannerFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'image_url', label: 'Image URL', minWidth: 200, align: 'left' },
  { id: 'action', label: 'Action', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const BannerTable: React.FC = () => {
  const settingContext = React.useContext(SettingContext);
  const setting = settingContext?.setting;
  const checkSettingSession = settingContext?.checkSettingSession;

  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = React.useState<string | null>(null);

  // Open confirmation dialog
  const handleOpenDialog = (image_url: string) => {
    setSelectedBanner(image_url);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBanner(null);
  };

  // Handle banner deletion
  const handleDeleteBanner = async () => {
    if (!selectedBanner) return;

    try {
      if (!setting?._id) {
        throw new Error('Setting ID is undefined');
      }
      const response = await DeleteBannerSettingApi(setting._id, selectedBanner);

      if (response.status === 200 || response.status === 201) {
        if (typeof checkSettingSession === 'function') {
          await checkSettingSession();
        }
        toast.success('Xóa banner thành công');
      } else {
        toast.error('Xóa banner thất bại');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Lỗi khi xóa banner. Vui lòng thử lại sau.');
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Box
      sx={{
        py: 2,
        px: 4,
        borderRadius: 2,
        boxShadow: 3,
        mt: 4,
        overflow: 'auto',
      }}
    >
      <Paper sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ px: 2, pt: 2 }}>
          Danh sách tất cả banner
        </Typography>
        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="banner-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {setting?.banner?.map((row, index) => (
                <TableRow hover tabIndex={-1} key={+index}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button variant="outlined" size="small" color="error" onClick={() => handleOpenDialog(row)}>
                            Delete
                          </Button>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={'http://localhost:5000/' + row}
                            alt="Banner"
                            style={{ maxWidth: '100px', maxHeight: '50px', marginRight: '8px' }}
                          />
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa banner</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa banner này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteBanner} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerTable;
