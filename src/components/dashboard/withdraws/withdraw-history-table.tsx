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
  { id: 'admin_accept', label: 'Quản trị chấp nhận', minWidth: 120, align: 'left' },
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

const WithdrawHistoryTable: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof WithdrawHistoryFormData | ''>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [filteredData, setFilteredData] = React.useState<WithdrawHistoryFormData[]>(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0); // Reset về trang 1 khi tìm kiếm
    const filtered = initialData.filter(
      (row) =>
        row.username.toLowerCase().includes(value) ||
        row.bank.toLowerCase().includes(value) ||
        row.note.toLowerCase().includes(value) ||
        row.status.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof WithdrawHistoryFormData) => {
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

  // Hàm xử lý khi nhấp nút "Cập nhật trạng thái"
  const handleUpdateStatus = (username: string, currentStatus: string) => {
    // Thay bằng logic thực tế (ví dụ: gọi API để cập nhật trạng thái)
    alert(`Cập nhật trạng thái cho người dùng: ${username} từ ${currentStatus}`);
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
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default WithdrawHistoryTable;
