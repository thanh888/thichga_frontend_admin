'use client';

import * as React from 'react';
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

// Định nghĩa interface cho dữ liệu bảng
interface BetHistoryFormData {
  code: string;
  username: string;
  money: number;
  created_at: string;
  status: string;
  admin_accept: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BetHistoryFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã (Code)', minWidth: 100, align: 'left' },
  { id: 'username', label: 'Tên người dùng', minWidth: 120, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'created_at', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'left' },
  { id: 'admin_accept', label: 'Quản trị chấp nhận', minWidth: 120, align: 'left' },
];

// Hàm tạo dữ liệu mẫu
function createData(
  code: string,
  username: string,
  money: number,
  created_at: string,
  status: string,
  admin_accept: string
): BetHistoryFormData {
  return { code, username, money, created_at, status, admin_accept };
}

const initialData: BetHistoryFormData[] = [
  createData('BET001', 'user1', 500, '2025-04-23 10:00', 'Pending', 'Waiting'),
  createData('BET002', 'user2', 1000, '2025-04-23 11:00', 'Won', 'Accepted'),
  createData('BET003', 'user3', 200, '2025-04-23 12:00', 'Lost', 'Rejected'),
  createData('BET004', 'user4', 0, '2025-04-23 13:00', 'Pending', 'Waiting'),
  createData('BET005', 'user5', 750, '2025-04-23 14:00', 'Won', 'Accepted'),
  createData('BET006', 'user6', 300, '2025-04-23 15:00', 'Lost', 'Rejected'),
];

const AutoDepositHistoryPage: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof BetHistoryFormData | ''>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [filteredData, setFilteredData] = React.useState<BetHistoryFormData[]>(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0); // Reset về trang 1 khi tìm kiếm
    const filtered = initialData.filter(
      (row) =>
        row.code.toLowerCase().includes(value) ||
        row.username.toLowerCase().includes(value) ||
        row.status.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof BetHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    const newOrder: 'asc' | 'desc' = isAsc ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      if (field === 'money') {
        return newOrder === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      return newOrder === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
    });
    setFilteredData(sortedData);
  };

  // Hàm xử lý khi nhấp nút "Xem chi tiết"
  const handleViewDetail = (code: string) => {
    // Thay bằng logic thực tế (ví dụ: mở modal, chuyển hướng)
    alert(`Xem chi tiết cho mã: ${code}`);
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
          <Table stickyHeader aria-label="bet-history-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id as keyof BetHistoryFormData];
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
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AutoDepositHistoryPage;
