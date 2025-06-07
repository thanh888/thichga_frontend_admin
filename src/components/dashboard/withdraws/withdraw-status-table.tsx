'use client';

import * as React from 'react';
import { WithdrawByStatusApi } from '@/services/dashboard/withdraw-history.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { WithdrawStatusEnum } from '@/utils/enum/withdraw-status.enum';
import { convertDateTimeVN } from '@/utils/functions/default-function';
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
  bank: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branch?: string;
    transferContent?: string;
  };
  feedback: string;
  userID: { _id: string; username: string };
  money: number;
  adminID: any;
  status: WithdrawStatusEnum;
  code: string;
  referenceCode: string;
  mode: DepositModeEnum;
  createdAt: string;
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
  { id: 'bank', label: 'Ngân hàng', minWidth: 120, align: 'left' },
  { id: 'mode', label: 'Phương thức', minWidth: 120, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'updatedAt', label: 'Ngày Cập nhật', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
  { id: 'feedback', label: 'Phản hồi', minWidth: 220, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithdrawStatusTable: React.FC<Props> = ({ isReload, setIsReload }) => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof WithdrawHistoryFormData>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: WithdrawHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any>(null);

  const statusLabels: { [key in WithdrawStatusEnum]: string } = {
    [WithdrawStatusEnum.PENDING]: 'Chờ xử lý',
    [WithdrawStatusEnum.PROCESSING]: 'Đang xử lý',
    [WithdrawStatusEnum.SUCCESS]: 'Thành công',
    [WithdrawStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Get status from tab value
  const getStatus = (tab: number) => {
    if (tab === 0) {
      return WithdrawStatusEnum.PENDING;
    } else if (tab === 1) {
      return WithdrawStatusEnum.PROCESSING;
    } else if (tab === 2) {
      return WithdrawStatusEnum.SUCCESS;
    } else {
      return WithdrawStatusEnum.REJECT;
    }
  };

  // Fetch data using API
  const fetchWithdraws = async () => {
    try {
      const status = getStatus(tabValue) ?? WithdrawStatusEnum.PENDING;
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${searchTerm}&status=${status}&sort=${sortQuery}`;
      const response = await WithdrawByStatusApi(query);
      if (response.status === 200 || response.status === 201) {
        setData({
          ...response.data,
          docs: response.data.docs,
        });
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
  }, [tabValue, page, rowsPerPage, searchTerm, sortField, sortOrder]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

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
  const handleOpenDialog = (rowData: any) => {
    setOpenDialog(rowData);
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
          Danh sách rút tiền
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 2,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 500,
              padding: '12px 24px',
              textTransform: 'none',
              color: '#555',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#1976d2',
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#1976d2',
              color: '#fff !important',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
              height: '4px',
              borderRadius: '2px',
            },
          }}
        >
          <Tab label="Chờ xử lý" />
          <Tab label="Đang xử lý(Auto)" />
          <Tab label="Thành công" />
          <Tab label="Đã từ chối" />
        </Tabs>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ my: 2, mx: 2 }}
        />
        <TableContainer sx={{ maxHeight: 540, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="withdraw-status-table">
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
                              : row.status === WithdrawStatusEnum.PENDING
                                ? 'Chưa xử lý'
                                : `Thủ công`}
                          </Typography>
                        </TableCell>
                      );
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
                            {statusLabels[row.status as WithdrawStatusEnum]}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'createdAt') {
                      value = convertDateTimeVN(row.createdAt);
                    } else if (column.id === 'updatedAt') {
                      value = convertDateTimeVN(row.updatedAt);
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
          rowsPerPageOptions={[10, 35, 50, 100]}
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

export default WithdrawStatusTable;
