'use client';

import * as React from 'react';
import { WidthdrawPaginate, WithdrawByStatusApi } from '@/services/dashboard/withdraw-history.api';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  Box,
  Button,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import UpdateWithdrawStatusComponent from './update-withdraw-status';

// Định nghĩa interface cho dữ liệu bảng
interface WithdrawHistoryFormData {
  bank: any;
  feedback: string;
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  createdAt: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof WithdrawHistoryFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã giao dịch', minWidth: 120, align: 'left' },
  { id: 'userID', label: 'Người dùng', minWidth: 150, align: 'left' },
  { id: 'bank', label: 'Ngân hàng', minWidth: 150, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'feedback', label: 'Ghi chú', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawHistoryTable: React.FC<Props> = ({ isReload, setIsReload }) => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof WithdrawHistoryFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: WithdrawHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any | null>(null);

  const statusLabels: { [key in WithdrawStatusEnum]: string } = {
    [WithdrawStatusEnum.PENDING]: 'Chờ xử lý',
    [WithdrawStatusEnum.SUCCESS]: 'Thành công',
    [WithdrawStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Fetch data using API
  const fetchWithdraws = async () => {
    try {
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${searchTerm}&sort=${sortQuery}`;
      const response = await WidthdrawPaginate(query);
      if (response.status === 200 || response.status === 201) {
        const transformedData = {
          ...response.data,
          docs: response.data.docs,
        };
        setData(transformedData);
      } else {
        setData({ docs: [], totalDocs: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch withdraw history:', error);
      setData({ docs: [], totalDocs: 0 });
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchWithdraws();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchWithdraws();
  }, [page, rowsPerPage, searchTerm, sortField, sortOrder]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle sorting
  const handleSort = (field: keyof WithdrawHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Open dialog for status update
  const handleOpenDialog = (data: any) => {
    console.log(data);

    setOpenDialog(data);
  };

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
          Danh sách tất cả yêu cầu rút tiền
        </Typography>

        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2, mx: 2 }}
        />
        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="withdraw-history-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={sortField === column.id}
                        direction={sortField === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id as keyof WithdrawHistoryFormData)}
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
                            size="small"
                            disabled={row.status !== WithdrawStatusEnum.PENDING}
                            onClick={() => handleOpenDialog(row)}
                          >
                            <BorderColorIcon />
                          </Button>
                        </TableCell>
                      );
                    }
                    let value = row[column.id as keyof WithdrawHistoryFormData];
                    if (column.id === 'userID') {
                      value = row?.userID?.username || 'N/A';
                    } else if (column.id === 'adminID') {
                      value = row?.adminID?.username || 'N/A';
                    } else if (column.id === 'bank') {
                      value = row?.bank?.bankName || 'N/A';
                    } else if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={
                              row.status === WithdrawStatusEnum.SUCCESS
                                ? '#1de9b6'
                                : row.status === WithdrawStatusEnum.REJECT
                                  ? '#e57373'
                                  : '#bdbdbd'
                            }
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                          >
                            {statusLabels[row.status as WithdrawStatusEnum] || row.status}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.totalDocs}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UpdateWithdrawStatusComponent openDialog={openDialog} setOpenDialog={setOpenDialog} setIsReload={setIsReload} />
    </Box>
  );
};

export default WithdrawHistoryTable;
