'use client';

import * as React from 'react';
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

// Định nghĩa interface cho dữ liệu bảng
interface WithdrawHistoryFormData {
  username: string;
  bank: string;
  money: number;
  note: string;
  created_at: string;
  status: string;
  admin_accept: string;
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
  { id: 'username', label: 'Tên người dùng', minWidth: 100, align: 'left' },
  { id: 'bank', label: 'Ngân hàng', minWidth: 120, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'note', label: 'Ghi chú', minWidth: 150, align: 'left' },
  { id: 'created_at', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'left' },
  { id: 'admin_accept', label: 'Quản trị chấp nhận', minWidth: 100, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

// Hàm tạo dữ liệu mẫu
function createData(
  username: string,
  bank: string,
  money: number,
  note: string,
  created_at: string,
  status: string,
  admin_accept: string
): WithdrawHistoryFormData {
  return { username, bank, money, note, created_at, status, admin_accept };
}

const initialData: WithdrawHistoryFormData[] = [
  createData('user1', 'Vietcombank', 500, 'Rút tiền lần 1', '2025-04-23 10:00', 'Pending', 'Waiting'),
  createData('user2', 'Techcombank', 1000, 'Rút thưởng', '2025-04-23 11:00', 'Won', 'Accepted'),
  createData('user3', 'MB Bank', 200, 'Rút tiền', '2025-04-23 12:00', 'Lost', 'Rejected'),
  createData('user4', 'VPBank', 0, 'Kiểm tra rút', '2025-04-23 13:00', 'Pending', 'Waiting'),
  createData('user5', 'Sacombank', 750, 'Rút tiền lần 2', '2025-04-23 14:00', 'Won', 'Accepted'),
  createData('user6', 'ACB', 300, 'Rút tiền', '2025-04-23 15:00', 'Lost', 'Rejected'),
];

const WithdrawStatusTable: React.FC = () => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [page, setPage] = React.useState<{ [key: string]: number }>({
    Pending: 0,
    Won: 0,
    Lost: 0,
  });
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof WithdrawHistoryFormData | ''>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  // Lọc dữ liệu theo trạng thái
  const filteredData = React.useMemo(() => {
    const status = tabValue === 0 ? 'Pending' : tabValue === 1 ? 'Won' : 'Lost';
    let data = initialData.filter((row) => row.status === status);

    // Tìm kiếm
    if (searchTerm) {
      data = data.filter(
        (row) =>
          row.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
          row.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === 'money') {
          return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        }
        return sortOrder === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      });
    }

    return data;
  }, [tabValue, searchTerm, sortField, sortOrder]);

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage((prev) => ({ ...prev, [getStatus(newValue)]: 0 })); // Reset trang khi đổi tab
  };

  // Lấy trạng thái từ giá trị tab
  const getStatus = (tab: number) => {
    return tab === 0 ? 'Pending' : tab === 1 ? 'Won' : 'Lost';
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage((prev) => ({ ...prev, [getStatus(tabValue)]: 0 }));
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof WithdrawHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = (username: string, currentStatus: string) => {
    // Thay bằng logic thực tế (ví dụ: gọi API để cập nhật trạng thái)
    alert(`Cập nhật trạng thái cho người dùng: ${username} từ ${currentStatus}`);
  };

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage((prev) => ({ ...prev, [getStatus(tabValue)]: newPage }));
  };

  // Hàm xử lý thay đổi số lượng bản ghi mỗi trang
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage((prev) => ({ ...prev, [getStatus(tabValue)]: 0 }));
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
          <Tab label="Chờ thanh toán" />
          <Tab label="Đã thanh toán" />
          <Tab label="Đã từ chối" />
        </Tabs>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          sx={{ my: 2, width: '40%' }}
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
              {filteredData
                .slice(page[getStatus(tabValue)] * rowsPerPage, page[getStatus(tabValue)] * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover tabIndex={-1} key={`${row.username}-${row.created_at}`}>
                    {columns.map((column) => {
                      if (column.id === 'action') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleUpdateStatus(row.username, row.status)}
                            >
                              Cập nhật trạng thái
                            </Button>
                          </TableCell>
                        );
                      }
                      const value = row[column.id as keyof WithdrawHistoryFormData];
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page[getStatus(tabValue)]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default WithdrawStatusTable;
