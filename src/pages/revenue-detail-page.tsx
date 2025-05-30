'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { deleteRevenueById, paginateRevenueByDateCloseApi } from '@/services/dashboard/revenue.api';
import { listRevenueType, numberThousandFload } from '@/utils/functions/default-function';
import {
  Box,
  Button,
  Card,
  CircularProgress,
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

// Define interface for revenue data
export interface RevenueFormData {
  _id: string;
  dateClose: string;
  revenue: number;
  expense: number;
  profit: number;
  betMoney: number;
  typeRevenue?: string;
  totalDeposits: number;
  totalWithdraw: number;
}

// Define interface for table columns
interface Column {
  id: keyof RevenueFormData;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number | string) => string;
}

const columns: Column[] = [
  {
    id: 'dateClose',
    label: 'Ngày đóng',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'revenue',
    label: 'Doanh thu',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'expense',
    label: 'Chi phí',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'profit',
    label: 'Hoa hồng',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'betMoney',
    label: 'Tiền cược',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'totalDeposits',
    label: 'Tiền nạp',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'totalWithdraw',
    label: 'Tiền rút',
    minWidth: 100,
    align: 'right',
  },
  { id: 'typeRevenue', label: 'Loại doanh thu', minWidth: 150, align: 'left' },
];

export default function RevenueByDateTable(): React.JSX.Element {
  const [revenues, setRevenues] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ dateClose: '', typeRevenue: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof RevenueFormData>('dateClose');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');

  const params = useParams();
  const dateClose = params?.id?.toString(); // Lấy dateClose từ URL (ví dụ: 2025-05-29)

  const [isReload, setIsReload] = React.useState<boolean>(true);

  const fetchRevenues = async () => {
    setIsLoading(true);
    console.log(dateClose);

    setError('');
    try {
      if (!dateClose) {
        setError('Không tìm thấy dữ liệu');
        setIsLoading(false);
        return;
      }
      const formattedDateClose = dateClose.replace(/-/g, '/'); // Chuyển 2025-05-29 thành 2025/05/29
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page * rowsPerPage}&search=${formattedDateClose}&typeRevenue=${filter.typeRevenue}&sort=${sortQuery}`;
      const response = await paginateRevenueByDateCloseApi(query);
      if (response.status === 200 || response.status === 201) {
        setRevenues(response.data);
      } else {
        setError('Không thể tải dữ liệu doanh thu, vui lòng thử lại');
      }
    } catch (err: any) {
      console.error('Failed to fetch revenues:', err);
      setError(err.response?.data?.message || 'Không thể tải dữ liệu doanh thu, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRevenues();
  }, [filter, page, rowsPerPage, order, orderBy, dateClose]);

  React.useEffect(() => {
    console.log('==========');

    if (isReload) {
      fetchRevenues();
      setIsReload(false);
    }
  }, [isReload]);

  const handleRequestSort = (property: keyof RevenueFormData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRevenue = async (id: string) => {
    try {
      const response = await deleteRevenueById(id);
      if (response.status === 200 || response.status === 201) {
        toast.success('Xóa thành công');
      }
    } catch (error) {}
    toast.error('Xóa thất bại');
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => fetchRevenues()} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        Doanh thu ngày {dateClose?.replace(/-/g, '/')}
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {revenues?.docs?.map((row: RevenueFormData) => (
              <TableRow hover key={row.dateClose}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">
                      {columns.find((col) => col.id === 'dateClose')?.format?.(row.dateClose) || row.dateClose}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#635bff', fontWeight: 600 }}>
                    {row?.revenue > 0 && '+'} {numberThousandFload(row?.revenue ?? '0') ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#f04438', fontWeight: 600 }}>
                    {numberThousandFload(row?.expense) ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#15b79f', fontWeight: 600 }}>
                    {row?.profit >= 0 ? '+' : '-'}
                    {numberThousandFload(row?.profit) ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                    {numberThousandFload(row?.betMoney) ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 600 }}>
                    {numberThousandFload(row?.totalDeposits) ?? 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ color: '#f44336', fontWeight: 600 }}>
                    {numberThousandFload(row?.totalWithdraw) ?? 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={
                      row.typeRevenue === 'BET'
                        ? '#4caf50'
                        : row.typeRevenue === 'DEPOSIT'
                          ? '#2196f3'
                          : row.typeRevenue === 'WITHDRAW'
                            ? '#f44336'
                            : '#9e9e9e'
                    }
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, color: 'white' }}
                  >
                    {row.typeRevenue
                      ? listRevenueType.find((item: any) => item.value === row.typeRevenue)?.label || 'Không xác định'
                      : 'Không xác định'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="error" onClick={() => handleDeleteRevenue(row._id)}>
                    Xóa
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
    </Card>
  );
}
