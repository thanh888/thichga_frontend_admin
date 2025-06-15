'use client';

import * as React from 'react';
import { deleteUserById, paginateAdminApi } from '@/services/dashboard/user.api';
import { rolesAdmin } from '@/utils/functions/default-function';
import { UserInterface } from '@/utils/interfaces/user.interface';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

import EditAdmin from './update-admin.dialog';

export interface AdminFormData {
  _id: string;
  username: string;
  role: string;
}
interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}
export function AdminsTable({ isReload, setIsReload }: Readonly<Props>): React.JSX.Element {
  const [accounts, setAccounts] = React.useState<any>(null);

  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

  const [filter, setFilter] = React.useState({ username: '', role: '' });

  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof AdminFormData>('username');

  const [openEdit, setOpenEdit] = React.useState<AdminFormData | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [userToDelete, setUserToDelete] = React.useState<UserInterface | null>(null);

  const fetchAccounts = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.username}&role=${filter.role}&sort=${sortQuery}`;
      const response = await paginateAdminApi(query);

      if (response.status === 200 || response.status === 201) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchAccounts();
      setIsReload(false);
    }
  }, [page, rowsPerPage, filter, order, orderBy, isReload]);

  React.useEffect(() => {
    fetchAccounts();
    setIsReload(false);
  }, [page, rowsPerPage, filter, order, orderBy]);

  const handleRequestSort = (property: keyof AdminFormData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(0); // Reset về trang đầu tiên khi lọc
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset về trang đầu tiên
  };

  const handleOpenDeleteDialog = (user: UserInterface) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete?._id) return;
    try {
      const response = await deleteUserById(userToDelete._id);
      if (response.status === 200 || response.status === 204) {
        fetchAccounts(); // Refresh the table
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        toast.success('Xóa người dùng thành công');
      } else {
        toast.error('Không thể xóa người dùng, vui lòng thử lại');
      }
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      alert(err.response?.data?.message || 'Không thể xóa người dùng, vui lòng thử lại');
    }
  };

  return (
    <Card>
      {/* Bộ lọc */}
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo tên đăng nhập"
          name="username"
          value={filter.username}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Chức vụ</InputLabel>
          <Select label="Chức vụ" name="role" value={filter.role} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            {rolesAdmin.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Bảng */}
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleRequestSort('username')}
                >
                  Tên đăng nhập
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleRequestSort('role')}
                >
                  Chức vụ
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.docs.map((row: AdminFormData) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2">{row.username}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{rolesAdmin.find((item) => item.value === row.role)?.label || ''}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOpenEdit(row)}>
                    <DriveFileRenameOutlineIcon />
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleOpenDeleteDialog(row)}>
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Phân trang */}
      <Divider />
      <TablePagination
        component="div"
        count={accounts?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <EditAdmin openEdit={openEdit} setOpenEdit={setOpenEdit} setIsReload={setIsReload} />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.username}"? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteUser} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
