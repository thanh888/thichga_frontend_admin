import React, { useContext } from 'react';
import { updateWithdrawStatusApi } from '@/services/dashboard/withdraw-history.api';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import { ConvertMoneyVND } from '@/utils/functions/default-function';
import { WithdrawTransactionInterface } from '@/utils/interfaces/withdraw-history.interface';
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
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

import { UserContext } from '@/contexts/user-context';
import { useSocket } from '@/hooks/socket';

interface Props {
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: WithdrawTransactionInterface | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<any>>;
}

const statusLabels: { [key in WithdrawStatusEnum]: string } = {
  [WithdrawStatusEnum.PENDING]: 'Chờ xử lý',
  [WithdrawStatusEnum.SUCCESS]: 'Thành công',
  [WithdrawStatusEnum.REJECT]: 'Đã từ chối',
};

const UpdateWithdrawStatusComponent: React.FC<Props> = ({ setIsReload, openDialog, setOpenDialog }) => {
  const [newStatus, setNewStatus] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState<string>('');

  const user = useContext(UserContext)?.user;
  const socket = useSocket();

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(null);
    setFeedback(''); // Reset feedback on close
  };

  React.useEffect(() => {
    if (openDialog) {
      setNewStatus(openDialog.status ?? '');
      setFeedback(openDialog.feedback ?? ''); // Initialize feedback from openDialog
    }
  }, [openDialog]);

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === openDialog?.status) {
      toast.warning('Vui lòng chọn trạng thái');
      return;
    }

    try {
      if (!openDialog?._id) {
        return;
      }
      const formData = {
        adminID: user._id,
        status: newStatus,
        ...(feedback && { feedback }), // Include feedback if non-empty
      };
      const response = await updateWithdrawStatusApi(openDialog._id, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('Cập nhật trạng thái thành công');
        setIsReload(true); // Trigger refresh

        if (socket) {
          socket.emit('withdraw-money', {
            userID: openDialog.userID._id,
            status: formData.status,
            money: openDialog?.money,
          });

          socket.off('withdraw-money');
        }
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating withdraw status:', error);
      toast.error('Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.');
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={!!openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="status-dialog-title"
      aria-describedby="status-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="status-dialog-title">Cập nhật trạng thái giao dịch</DialogTitle>
      <DialogContent>
        <TextField label="Tên ngân hàng" value={openDialog?.bank?.bankName || ''} fullWidth margin="dense" disabled />
        <TextField
          label="Số tài khoản"
          value={openDialog?.bank?.accountNumber || ''}
          fullWidth
          margin="dense"
          disabled
        />
        <TextField
          label="Tên chủ tài khoản"
          value={openDialog?.bank?.accountName || ''}
          fullWidth
          margin="dense"
          disabled
        />
        <TextField label="Chi nhánh" value={openDialog?.bank?.branch || ''} fullWidth margin="dense" disabled />
        <TextField
          label="Số tiền"
          value={ConvertMoneyVND(Number(openDialog?.money) ?? 0) || '0'}
          fullWidth
          margin="dense"
          disabled
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select label="Trạng thái" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {Object.values(WithdrawStatusEnum).map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Ghi chú"
          variant="outlined"
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mt: 2 }}
          multiline
          rows={3}
        />
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

export default UpdateWithdrawStatusComponent;
