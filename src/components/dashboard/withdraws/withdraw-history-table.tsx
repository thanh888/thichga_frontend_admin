'use client';

import * as React from 'react';
import { WidthdrawPaginate } from '@/services/dashboard/withdraw-history.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import { convertDateTimeVN } from '@/utils/functions/default-function';
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

import UpdateWithdrawStatusComponent from './update-withdraw-status';

// Định nghĩa interface cho dữ liệu bảng
interface WithdrawHistoryFormData {
  bank: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branch?: string;
    transferContent?: string;
  };
  feedback: string;
  userID: any;
  money: number;
  adminID: any;
  status: WithdrawStatusEnum;
  code: string;
  createdAt: string;
  referenceCode: string;
  mode: DepositModeEnum;
  updatedAt: string;
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
  { id: 'referenceCode', label: 'Mã tham chiếu', minWidth: 120, align: 'left' },

  { id: 'userID', label: 'Người dùng', minWidth: 150, align: 'left' },
  { id: 'bank', label: 'Ngân hàng', minWidth: 150, align: 'left' },
  { id: 'mode', label: 'Phương thức', minWidth: 120, align: 'left' },

  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'updatedAt', label: 'Ngày cập nhật', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'feedback', label: 'Ghi chú', minWidth: 250, align: 'left' },
  // { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawHistoryTable: React.FC<Props> = ({ isReload, setIsReload }) => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [usernameFilter, setUsernameFilter] = React.useState<string>(''); // Thêm filter username
  const [sortField, setSortField] = React.useState<keyof WithdrawHistoryFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: WithdrawHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any | null>(null);

  const statusLabels: { [key in WithdrawStatusEnum]: string } = {
    [WithdrawStatusEnum.PENDING]: 'Chờ xử lý',
    [WithdrawStatusEnum.PROCESSING]: 'Đang xử lý',
    [WithdrawStatusEnum.SUCCESS]: 'Thành công',
    [WithdrawStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Fetch data using API
  const fetchWithdraws = async () => {
    try {
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      let query = `limit=${rowsPerPage}&skip=${page + 1}&search=${searchTerm}&sort=${sortQuery}`;
      if (usernameFilter) {
        query += `&username=${encodeURIComponent(usernameFilter)}`;
      }
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
  }, [page, rowsPerPage, searchTerm, sortField, sortOrder, usernameFilter]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle username filter
  const handleUsernameFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameFilter(event.target.value);
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
          Lịch sử rút tiền
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, px: 2, mb: 2 }}>
          <TextField
            label="Tìm kiếm"
            placeholder="Tìm theo mã, nội dung..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
          <TextField
            label="Lọc theo Username"
            placeholder="Nhập username"
            variant="outlined"
            size="small"
            fullWidth
            value={usernameFilter}
            onChange={handleUsernameFilter}
          />
        </Box>
        <TableContainer sx={{ maxHeight: 540, overflowX: 'auto' }}>
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
              {data?.docs?.map((row: WithdrawHistoryFormData) => (
                <TableRow hover tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={![WithdrawStatusEnum.PENDING, WithdrawStatusEnum.PROCESSING].includes(row.status)}
                            onClick={() => handleOpenDialog(row)}
                          >
                            <BorderColorIcon />
                          </Button>
                        </TableCell>
                      );
                    }
                    let value: any = row[column.id as keyof WithdrawHistoryFormData];
                    if (column.id === 'referenceCode') {
                      value = row?.referenceCode || '';
                    }
                    if (column.id === 'userID') {
                      value = row.userID?.username || 'N/A';
                    } else if (column.id === 'adminID') {
                      value = row?.adminID?.username || 'N/A';
                    } else if (column.id === 'bank') {
                      value = row.bank?.bankName || 'N/A';
                    } else if (column.id === 'mode') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={row.mode === DepositModeEnum.AUTO || row.referenceCode ? '#4caf50 ' : '#ff9800 '}
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16, whiteSpace: 'nowrap' }}
                          >
                            {(row.mode === DepositModeEnum.AUTO || row.referenceCode) && row.referenceCode
                              ? 'Tự động'
                              : `Thủ công`}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={row.mode === DepositModeEnum.AUTO || row.referenceCode ? '#4caf50 ' : '#ff9800 '}
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16, whiteSpace: 'nowrap' }}
                          >
                            {(row.mode === DepositModeEnum.AUTO || row.referenceCode) && row.referenceCode
                              ? 'Tự động'
                              : row.status === WithdrawStatusEnum.PENDING
                                ? 'Chưa xử lý'
                                : `Thủ công`}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'createdAt') {
                      value = convertDateTimeVN(row.createdAt);
                    } else if (column.id === 'updatedAt') {
                      value = convertDateTimeVN(row.createdAt);
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
