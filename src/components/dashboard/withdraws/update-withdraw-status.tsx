import React, { useContext } from 'react';
import { updateWithdrawStatusApi, updateWithdrawStatusAutoApi } from '@/services/dashboard/withdraw-history.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import { numberThousandFload } from '@/utils/functions/default-function';
import { WithdrawTransactionInterface } from '@/utils/interfaces/withdraw-history.interface';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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

enum TypeWithdraw {
  PENDING = 'PENDING',
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
  REJECT = 'REJECT',
}

const statusLabels: { [key in TypeWithdraw]: string } = {
  [TypeWithdraw.PENDING]: 'Chờ xử lý',
  [TypeWithdraw.MANUAL]: 'Rút thủ công',
  [TypeWithdraw.AUTO]: 'Rút tự động',
  [TypeWithdraw.REJECT]: 'Từ chối',
};

const statusLabelsOfAuto: { [key in WithdrawStatusEnum]: string } = {
  [WithdrawStatusEnum.PENDING]: 'Chờ xử lý',
  [WithdrawStatusEnum.PROCESSING]: 'Đang xử lý',
  [WithdrawStatusEnum.SUCCESS]: 'Thành công',
  [WithdrawStatusEnum.REJECT]: 'Đã từ chối',
};

const UpdateWithdrawStatusComponent: React.FC<Props> = ({ setIsReload, openDialog, setOpenDialog }) => {
  const [newStatus, setNewStatus] = React.useState<string>('');
  const [feedback, setFeedback] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

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
      toast.warning('Vui lòng chọn trạng thái khác');
      return;
    }
    setLoading(true);
    try {
      if (!openDialog?._id || !user) {
        setLoading(false);
        return;
      }
      const formData = {
        adminID: user._id,
        status: newStatus,
        money: openDialog.money,
        userID: openDialog.userID._id,
        ...(feedback && { feedback }), // Include feedback if non-empty
        feedback,
        bankCode: openDialog?.bank?.code,
        accountNumber: openDialog?.bank?.accountNumber,
        accountName: openDialog?.bank?.accountName,
      };

      if (newStatus === TypeWithdraw.MANUAL) {
        Object.assign(formData, { mode: DepositModeEnum.MANUAL, status: WithdrawStatusEnum.SUCCESS });
      }
      if (newStatus === TypeWithdraw.AUTO) {
        Object.assign(formData, { mode: DepositModeEnum.AUTO, status: WithdrawStatusEnum.PROCESSING });
        const response = await updateWithdrawStatusAutoApi(openDialog._id, formData);
        if (response.status === 200 || response.status === 201) {
          toast.success('Cập nhật trạng thái thành công');
          setIsReload(true); // Trigger refresh
        }
      } else {
        const response = await updateWithdrawStatusApi(openDialog._id, formData);
        if (response.status === 200 || response.status === 201) {
          toast.success('Cập nhật trạng thái thành công');
          setIsReload(true); // Trigger refresh

          if (socket && newStatus === TypeWithdraw.MANUAL) {
            socket.emit('withdraw-money', {
              userID: openDialog.userID._id,
              status: formData.status,
              money: openDialog?.money,
            });

            socket.off('withdraw-money');
          }
        }
      }
    } catch (error) {
      console.error('Error updating withdraw status:', error);
      toast.error('Lỗi khi cập nhật trạng thái. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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
          label="Số tiền"
          value={numberThousandFload(Number(openDialog?.money) ?? 0) || '0'}
          fullWidth
          margin="dense"
          sx={{
            pointerEvents: 'none',
          }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select label="Trạng thái" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {openDialog?.mode === DepositModeEnum.AUTO || openDialog?.status === WithdrawStatusEnum.PROCESSING
              ? Object.values(WithdrawStatusEnum).map(
                  (status) =>
                    status !== WithdrawStatusEnum.PENDING && (
                      <MenuItem key={status} value={status}>
                        {statusLabelsOfAuto[status]}
                      </MenuItem>
                    )
                )
              : Object.values(TypeWithdraw).map((status) => (
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

export default UpdateWithdrawStatusComponent;
