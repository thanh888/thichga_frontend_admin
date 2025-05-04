'use client';

import * as React from 'react';
import { DepositByStatusApi } from '@/services/dashboard/deposit-history.api';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
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

// Assumed API for deposit history

// Định nghĩa interface cho dữ liệu bảng
interface DepositHistoryFormData {
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  createdAt: string;
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
  { id: 'code', label: 'Mã giao dịch', minWidth: 100, align: 'left' },
  { id: 'userID', label: 'Người dùng', minWidth: 150, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const DepositStatusTable: React.FC<Props> = () => {
  const [isReload, setIsReload] = React.useState<boolean>(true);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof DepositHistoryFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: DepositHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });

  // const [status, setStatus] = React.useState<string>(DepositStatusEnum.PENDING);
  // Lấy trạng thái từ giá trị tab
  const getStatus = (tab: number) => {
    return tab === 0 ? DepositStatusEnum.PENDING : tab === 1 ? DepositStatusEnum.SUCCESS : DepositStatusEnum.REJECT;
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    try {
      const status = getStatus(tabValue) ?? DepositStatusEnum.PENDING;
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page * rowsPerPage}&search=${searchTerm}&status=${status}&sort=${sortQuery}`;
      const response = await DepositByStatusApi(query);
      if (response.status === 200 || response.status === 201) {
        // Transform userID and adminID to usernames
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
  }, [tabValue, page, rowsPerPage, searchTerm, sortField, sortOrder]);

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage((prev) => 0);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof DepositHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = (code: string, currentStatus: string) => {
    // Placeholder for API call
    alert(`Cập nhật trạng thái cho giao dịch: ${code} từ ${currentStatus}`);
    setIsReload(true); // Trigger refresh after update
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Hàm xử lý thay đổi số lượng bản ghi mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
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
          Danh sách nạp tiền
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
          <Tab label="Đang chờ" />
          <Tab label="Đã nạp" />
          <Tab label="Đã từ chối" />
        </Tabs>

        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="deposit-status-table">
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
                            size="small"
                            onClick={() => handleUpdateStatus(row.code, row.status)}
                          >
                            Cập nhật trạng thái
                          </Button>
                        </TableCell>
                      );
                    }
                    let value = row[column.id as keyof DepositHistoryFormData];
                    if (column.id === 'userID') {
                      value = row?.userID?.username || 'N/A';
                    } else if (column.id === 'adminID') {
                      value = row?.adminID?.username || 'N/A';
                    } else if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={row.status === 'Won' ? '#1de9b6' : row.status === 'Lost' ? '#e57373' : '#bdbdbd'}
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                          >
                            {row.status}
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
    </Box>
  );
};

export default DepositStatusTable;
