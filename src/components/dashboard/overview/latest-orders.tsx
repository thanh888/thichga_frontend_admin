'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { paginateRevenueApi } from '@/services/dashboard/revenue.api'; // Giả định API

import { BettingRevenueInterface } from '@/utils/interfaces/revenue.interface';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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

export interface RevenueFormData {
  _id: string;
  dateClose: string;
  revenue: number;
  expense: number;
  profit: number;
  typeRevenue?: string; // Nếu có
}

export function RevenueTable(): React.JSX.Element {
  const [isReload, setIsReload] = React.useState(true);
  const [revenues, setRevenues] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ dateClose: '', typeRevenue: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof BettingRevenueInterface>('dateClose');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [revenueToDelete, setRevenueToDelete] = React.useState<BettingRevenueInterface | null>(null);

  const router = useRouter();

  const fetchRevenues = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.dateClose}&typeRevenue=${filter.typeRevenue}&sort=${sortQuery}`;
      const response = await paginateRevenueApi(query);
      if (response.status === 200 || response.status === 201) {
        setRevenues(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch revenues:', error);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleDeleteRevenue = async () => {
    // if (!revenueToDelete) return;
    // try {
    //   // Giả định có API deleteRevenueById
    //   // const response = await deleteRevenueById(revenueToDelete._id);
    //   // if (response.status === 200 || response.status === 204) {
    //   fetchRevenues(); // Refresh the table
    //   setDeleteDialogOpen(false);
    //   setRevenueToDelete(null);
    //   toast.success('Xóa doanh thu thành công');
    //   // } else {
    //   //   toast.error('Không thể xóa doanh thu, vui lòng thử lại');
    //   // }
    // } catch (err: any) {
    //   console.error('Failed to delete revenue:', err);
    //   toast.error('Không thể xóa doanh thu, vui lòng thử lại');
    // }
  };

  const handleOpenDeleteDialog = (revenue: RevenueFormData) => {
    setRevenueToDelete(revenue);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRevenueToDelete(null);
  };

  React.useEffect(() => {
    if (isReload) {
      fetchRevenues();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchRevenues();
  }, [page, rowsPerPage, filter, order, orderBy]);

  const handleRequestSort = (property: keyof BettingRevenueInterface) => {
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

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('/');
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo ngày đóng (YYYY/MM/DD)"
          name="dateClose"
          value={filter.dateClose}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Loại doanh thu</InputLabel>
          <Select label="Loại doanh thu" name="typeRevenue" value={filter.typeRevenue} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="BET">Bet</MenuItem>
            <MenuItem value="DEPOSIT">Deposit</MenuItem>
            <MenuItem value="WITHDRAW">Withdraw</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dateClose'}
                  direction={orderBy === 'dateClose' ? order : 'asc'}
                  onClick={() => handleRequestSort('dateClose')}
                >
                  Ngày đóng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'revenue'}
                  direction={orderBy === 'revenue' ? order : 'asc'}
                  onClick={() => handleRequestSort('revenue')}
                >
                  Doanh thu
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'expense'}
                  direction={orderBy === 'expense' ? order : 'asc'}
                  onClick={() => handleRequestSort('expense')}
                >
                  Chi phí
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'profit'}
                  direction={orderBy === 'profit' ? order : 'asc'}
                  onClick={() => handleRequestSort('profit')}
                >
                  Lợi nhuận
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenues?.docs?.map((row: RevenueFormData) => (
              <TableRow hover key={row._id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{formatDate(row.dateClose)}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#635bff', fontWeight: 600 }}>
                    {row?.revenue >= 0 ? '+' : '-'} {row?.revenue?.toLocaleString() ?? 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#f04438', fontWeight: 600 }}>
                    {row?.expense?.toLocaleString() ?? 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: '#15b79f', fontWeight: 600 }}>
                    {row?.profit >= 0 ? '+' : '-'}
                    {row?.profit?.toLocaleString() ?? 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => router.push(`revenues/${row._id}`)}
                  >
                    Chi tiết
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
        count={revenues?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa doanh thu</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa bản ghi doanh thu vào ngày "{revenueToDelete?.dateClose}"? Hành động này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteRevenue} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
