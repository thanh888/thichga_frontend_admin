import React, { useContext } from 'react';
import { updateDepositStatusApi } from '@/services/dashboard/deposit-history.api';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { toast } from 'react-toastify';

import { UserContext } from '@/contexts/user-context';

interface Props {
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: any;
  setOpenDialog: React.Dispatch<React.SetStateAction<any>>;
}

const statusLabels: { [key in DepositStatusEnum]: string } = {
  [DepositStatusEnum.PENDING]: 'Chờ xử lý',
  [DepositStatusEnum.SUCCESS]: 'Thành công',
  [DepositStatusEnum.REJECT]: 'Đã từ chối',
};

const UpdateDepositStatusComponent: React.FC<Props> = ({ setIsReload, openDialog, setOpenDialog }) => {
  const [newStatus, setNewStatus] = React.useState<string>('');

  const user = useContext(UserContext)?.user;

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  React.useEffect(() => {
    if (openDialog) {
      setNewStatus(openDialog.status || '');
    }
  }, [openDialog]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === openDialog.status) {
      handleCloseDialog();
      return;
    }

    try {
      const formData = {
        adminID: user._id,
        status: newStatus,
      };
      const response = await updateDepositStatusApi(openDialog._id, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('Cập nhật trạng thái thành công');
        setIsReload(true); // Trigger refresh
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating deposit status:', error);
      toast.error('Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.');
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="status-dialog-title"
      aria-describedby="status-dialog-description"
    >
      <DialogTitle id="status-dialog-title">Cập nhật trạng thái giao dịch</DialogTitle>
      <DialogContent>
        <DialogContentText id="status-dialog-description" sx={{ mb: 2 }}>
          Cập nhật trạng thái nạp tiền: {openDialog?.code}
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select label="Trạng thái" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {Object.values(DepositStatusEnum).map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Hủy
        </Button>
        <Button onClick={handleUpdateStatus} color="primary" autoFocus>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDepositStatusComponent;
