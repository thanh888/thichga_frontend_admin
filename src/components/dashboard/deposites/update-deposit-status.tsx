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
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

import { UserContext } from '@/contexts/user-context';
import { useSocket } from '@/hooks/socket';

interface Props {
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: any;
  setOpenDialog: React.Dispatch<React.SetStateAction<any>>;
}

const statusLabels: { [key in DepositStatusEnum]: string } = {
  [DepositStatusEnum.PENDING]: 'Chờ xử lý',
  [DepositStatusEnum.SUCCESS]: 'Thành công',
  [DepositStatusEnum.REJECT]: 'Từ chối',
};

const UpdateDepositStatusComponent: React.FC<Props> = ({ setIsReload, openDialog, setOpenDialog }) => {
  const [newStatus, setNewStatus] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const user = useContext(UserContext)?.user;
  const socket = useSocket();

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
      toast.warning('Vui lòng chọn trạng thái');
      return;
    }
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const formData = {
        userID: openDialog?.userID?._id,
        money: openDialog?.money,
        adminID: user._id,
        status: newStatus,
      };
      const response = await updateDepositStatusApi(openDialog._id, formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('Cập nhật trạng thái thành công');
        setIsReload(true);
        if (socket) {
          socket.emit('deposit-money', { userID: formData.userID, status: formData.status, money: formData.money });

          socket.off('deposit-money');
        }
      } else {
        toast.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Error updating deposit status:', error);
      toast.error('Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="status-dialog-title"
      aria-describedby="status-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="status-dialog-title">Cập nhật đơn nạp tiền</DialogTitle>
      <DialogContent>
        <DialogContentText id="status-dialog-description" sx={{ mb: 2 }}>
          Cập nhật trạng thái nạp tiền: {openDialog?.code}
        </DialogContentText>

        {/* Display bank details as  sx={{
            pointerEvents: 'none',
          }} text fields */}
        <TextField
          label="Tên ngân hàng"
          value={openDialog?.bank?.bankName || ''}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />
        <TextField
          label="Số tài khoản"
          value={openDialog?.bank?.accountNumber || ''}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />
        <TextField
          label="Tên chủ tài khoản"
          value={openDialog?.bank?.accountName || ''}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />
        <TextField
          label="Chi nhánh"
          value={openDialog?.bank?.branch || ''}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />
        <TextField
          label="Nội dung chuyển khoản"
          value={openDialog?.bank?.transferContent || ''}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />

        {/* Status selection */}
        <FormControl fullWidth sx={{ mt: 2 }}>
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
        <Button onClick={handleCloseDialog} color="primary" disabled={loading}>
          Hủy
        </Button>
        <Button onClick={handleUpdateStatus} color="primary" autoFocus disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDepositStatusComponent;
