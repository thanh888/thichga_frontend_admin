'use client';

import * as React from 'react';
import { paginate } from '@/services/dashboard/deposit-history.api';
import { DepositMethod } from '@/utils/enum/deposit-method.enum';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import UpdateDepositStatusComponent from './update-deposit-status';

// Assumed API for deposit history

// Định nghĩa interface cho dữ liệu bảng
interface DepositHistoryFormData {
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  referenceCode: string;
  createdAt: string;
  mode: DepositModeEnum;
  method: DepositMethod;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof DepositHistoryFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã code', minWidth: 100, align: 'left' },
  { id: 'userID', label: 'Người tạo', minWidth: 150, align: 'left' },
  { id: 'referenceCode', label: 'Mã tự động', minWidth: 100, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'mode', label: 'Phương thức', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];
interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const DepositHistoryTable: React.FC<Props> = ({ isReload, setIsReload }) => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [usernameFilter, setUsernameFilter] = React.useState<string>(''); // Thêm filter username
  const [sortField, setSortField] = React.useState<keyof DepositHistoryFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: DepositHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });

  const [openDialog, setOpenDialog] = React.useState<any>(null);
  const [dateFilter, setDateFilter] = React.useState<string>(''); // Thêm filter ngày

  const statusLabels: { [key in DepositStatusEnum]: string } = {
    [DepositStatusEnum.PENDING]: 'Chờ xử lý',
    [DepositStatusEnum.SUCCESS]: 'Thành công',
    [DepositStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    try {
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      let query = `limit=${rowsPerPage}&skip=${page + 1}&search=${searchTerm}&sort=${sortQuery}&mode=${DepositModeEnum.MANUAL}`;
      if (usernameFilter) {
        query += `&username=${encodeURIComponent(usernameFilter)}`;
      }
      if (dateFilter) {
        query += `&date=${encodeURIComponent(dateFilter)}`;
      }
      const response = await paginate(query);
      if (response.status === 200 || response.status === 201) {
        setData({
          ...response.data,
          docs: response.data.docs,
        });
      } else {
        setData({ docs: [], totalDocs: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
      setData({ docs: [], totalDocs: 0 });
    }
  };

  const handleOpenDialog = (data: any) => {
    setOpenDialog(data);
  };

  React.useEffect(() => {
    if (isReload) {
      fetchDeposits();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchDeposits();
  }, [page, rowsPerPage, searchTerm, sortField, sortOrder, usernameFilter, dateFilter]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Hàm xử lý filter username
  const handleUsernameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameFilter(event.target.value);
    setPage(0);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof DepositHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Hàm xử lý thay đổi số lượng bản ghi mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
          Danh sách tất cả yêu cầu nạp tiền
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, px: 2, mb: 2 }}>
          <TextField
            label="Tìm kiếm"
            placeholder="Tìm theo mã, nội dung..."
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <TextField
            label="Lọc theo Username"
            placeholder="Nhập username"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1 }}
            value={usernameFilter}
            onChange={handleUsernameFilter}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DatePicker
                value={dateFilter ? dayjs(dateFilter) : null}
                onChange={(e) => setDateFilter(e ? e.format('YYYY-MM-DD') : '')}
                label="Lọc theo ngày"
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              {dateFilter && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setDateFilter('')}
                  sx={{ minWidth: 0, px: 1, height: 40 }}
                >
                  Xóa
                </Button>
              )}
            </Box>
          </LocalizationProvider>
        </Box>
        <TableContainer sx={{ maxHeight: 560, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="deposit-history-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={sortField === column.id}
                        direction={sortField === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id as keyof DepositHistoryFormData)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.docs?.map((row) => (
                <TableRow hover tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            variant="outlined"
                            disabled={row.status !== DepositStatusEnum.PENDING}
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                          >
                            <BorderColorIcon />
                          </Button>
                        </TableCell>
                      );
                    }
                    let value = row[column.id as keyof DepositHistoryFormData];
                    if (column.id === 'userID') {
                      value = row?.userID?.username || 'N/A';
                    } else if (column.id === 'referenceCode') {
                      value = row?.referenceCode || '';
                    } else if (column.id === 'adminID') {
                      value = row?.adminID?.username || 'N/A';
                    } else if (column.id === 'mode') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={row.mode === DepositModeEnum.AUTO ? '#1de9b6' : '#e57373'}
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16, whiteSpace: 'nowrap' }}
                          >
                            {row.mode === DepositModeEnum.AUTO ? 'Tự động' : `Thủ công(${row.method})`}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={
                              row.status === DepositStatusEnum.SUCCESS
                                ? '#1de9b6'
                                : row.status === DepositStatusEnum.REJECT
                                  ? '#e57373'
                                  : '#bdbdbd'
                            }
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                          >
                            {statusLabels[row.status as DepositStatusEnum] || row.status}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'createdAt') {
                      value = new Date(row.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={data.totalDocs}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UpdateDepositStatusComponent openDialog={openDialog} setOpenDialog={setOpenDialog} setIsReload={setIsReload} />
    </Box>
  );
};

export default DepositHistoryTable;
