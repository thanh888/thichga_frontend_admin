'use client';

import * as React from 'react';
import { paginate } from '@/services/dashboard/deposit-history.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
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

import UpdateDepositStatusComponent from '@/components/dashboard/deposites/update-deposit-status';

// Định nghĩa interface cho dữ liệu bảng
interface AutoDepositFormData {
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  createdAt: string;
  transactionCode: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof AutoDepositFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã tra cứu', minWidth: 100, align: 'left' },
  { id: 'userID', label: 'Người dùng', minWidth: 120, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 120, align: 'left' },
  { id: 'transactionCode', label: 'Mã giao dịch ngân hàng', minWidth: 120, align: 'left' },
  // { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AutoDepositHistoryPage = () => {
  const [isReload, setIsReload] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof AutoDepositFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: AutoDepositFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any>(null);

  const statusLabels: { [key in DepositStatusEnum]: string } = {
    [DepositStatusEnum.PENDING]: 'Chờ xử lý',
    [DepositStatusEnum.SUCCESS]: 'Thành công',
    [DepositStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    try {
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${searchTerm}&sort=${sortQuery}&mode=${DepositModeEnum.AUTO}`;
      const response = await paginate(query);
      if (response.status === 200 || response.status === 201) {
        const transformedData = {
          ...response.data,
          docs: response.data.docs.map((item: any) => ({
            ...item,
            userID: item.userID?.username || 'N/A',
            adminID: item.adminID?.username || 'N/A',
          })),
        };
        setData(transformedData);
      } else {
        setData({ docs: [], totalDocs: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
      setData({ docs: [], totalDocs: 0 });
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchDeposits();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchDeposits();
  }, [page, rowsPerPage, searchTerm, sortField, sortOrder]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle sorting
  const handleSort = (field: keyof AutoDepositFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Handle open dialog for status update
  const handleOpenDialog = (row: AutoDepositFormData) => {
    setOpenDialog(row);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
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
          Danh sách nạp tiền tự động
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
          <Table stickyHeader aria-label="auto-deposit-history-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={sortField === column.id}
                        direction={sortField === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id as keyof AutoDepositFormData)}
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
                            disabled={row.status !== DepositStatusEnum.PENDING}
                            onClick={() => handleOpenDialog(row)}
                          >
                            Cập nhật trạng thái
                          </Button>
                        </TableCell>
                      );
                    }
                    let value = row[column.id as keyof AutoDepositFormData];
                    if (column.id === 'userID') {
                      value = row.userID || 'N/A';
                    } else if (column.id === 'adminID') {
                      value = row.adminID || 'N/A';
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
          rowsPerPageOptions={[5, 10, 25]}
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

export default AutoDepositHistoryPage;
