'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { deleteUserById, getListReferralBy, paginateUserApi } from '@/services/dashboard/user.api';
import { convertDateTime } from '@/utils/functions/default-function';
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

import { paths } from '@/paths';

import EditUser from './update-user.dialog';

export interface UserFormData {
  _id: string;
  username: string;
  status: string;
  referrer: string;
  createdAt: string;
}

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UsersTable({ isReload, setIsReload }: Readonly<Props>): React.JSX.Element {
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ username: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof UserFormData>('username');
  const [openEdit, setOpenEdit] = React.useState<UserInterface | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [userToDelete, setUserToDelete] = React.useState<UserInterface | null>(null);
  const [listReferralBys, setListReferralBys] = React.useState<any[]>([]);

  const fetchAccounts = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.username}&sort=${sortQuery}`;
      const response = await paginateUserApi(query);
      if (response.status === 200 || response.status === 201) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
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

  const handleOpenDeleteDialog = (user: UserInterface) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  React.useEffect(() => {
    if (isReload) {
      fetchAccounts();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListReferralBy();
        if (response.status === 200 || response.status === 201) {
          setListReferralBys(response.data);
        }
      } catch (error) {
        console.error('Error fetching referral list:', error);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    fetchAccounts();
  }, [page, rowsPerPage, filter.username, order, orderBy]);

  const handleRequestSort = (property: keyof UserFormData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(0); // Reset to first page when filtering
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo tên đăng nhập"
          name="username"
          value={filter.username}
          onChange={handleFilterChange}
          size="small"
        />
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
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
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'referrer'}
                  direction={orderBy === 'referrer' ? order : 'asc'}
                  onClick={() => handleRequestSort('referrer')}
                >
                  Người giới thiệu
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.docs.map((row: UserInterface) => (
              <TableRow hover key={row._id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row?.username}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row?.status}</TableCell>
                <TableCell>{row?.referral_receiver_id?.username}</TableCell>
                <TableCell>{convertDateTime(row?.createdAt?.toString() ?? '')}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOpenEdit(row)}>
                    <DriveFileRenameOutlineIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => router.push(paths.dashboard.user_bet_history + '/' + row._id)}
                  >
                    LS Cược
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => router.push(paths.dashboard.user_deposit_withdraw + '/' + row._id)}
                  >
                    Chuyển & Rút tiền
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
      {openEdit && (
        <EditUser
          openEdit={openEdit}
          setOpenEdit={setOpenEdit}
          setIsReload={setIsReload}
          listReferralBys={listReferralBys}
        />
      )}
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
