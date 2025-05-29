'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateRevenueApi } from '@/services/dashboard/revenue.api';
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

// Define interface for revenue data
export interface RevenueFormData {
  dateClose: string;
  revenue: number;
  expense: number;
  profit: number;
  betMoney: number;
  typeRevenue?: string;
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
    label: 'Lợi nhuận',
    minWidth: 100,
    align: 'right',
  },
  {
    id: 'betMoney',
    label: 'Tiền cược',
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

  const router = useRouter();
  const params = useParams();
  const dateClose = params?.dateClose?.toString(); // Lấy dateClose từ URL (ví dụ: 2025-05-29)

  const fetchRevenues = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!dateClose) {
        setError('Không tìm thấy ngày đóng');
        setIsLoading(false);
        return;
      }
      const formattedDateClose = dateClose.replace(/-/g, '/'); // Chuyển 2025-05-29 thành 2025/05/29
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page * rowsPerPage}&search=${formattedDateClose}&typeRevenue=${filter.typeRevenue}&sort=${sortQuery}`;
      const response = await paginateRevenueApi(query);
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

  const handleViewDetail = (dateClose: string) => {
    router.push(`/revenues/${dateClose.replace(/\//g, '-')}`);
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
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo ngày đóng (YYYY/MM/DD)"
          name="dateClose"
          value={filter.dateClose}
          onChange={handleFilterChange}
          size="small"
          sx={{ width: '50%' }}
        />
        <FormControl sx={{ width: '50%' }} size="small">
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
                  {columns.find((col) => col.id === 'revenue')?.format?.(row.revenue) || row.revenue}
                </TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'expense')?.format?.(row.expense) || row.expense}
                </TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'profit')?.format?.(row.profit) || row.profit}
                </TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'betMoney')?.format?.(row.betMoney) || row.betMoney}
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
                    {row.typeRevenue || 'Không xác định'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="primary" onClick={() => handleViewDetail(row.dateClose)}>
                    Chi tiết
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
