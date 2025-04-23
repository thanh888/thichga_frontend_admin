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
interface BetData {
  code: string;
  status: string;
  created_at: string;
  profit: number;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BetData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã (Code)', minWidth: 100, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'left' },
  { id: 'created_at', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  {
    id: 'profit',
    label: 'Lợi nhuận (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

// Hàm tạo dữ liệu mẫu
function createData(code: string, status: string, created_at: string, profit: number): BetData {
  return { code, status, created_at, profit };
}

const initialData: BetData[] = [
  createData('BET001', 'Pending', '2025-04-23 10:00', 500),
  createData('BET002', 'Won', '2025-04-23 11:00', 1000),
  createData('BET003', 'Lost', '2025-04-23 12:00', -200),
  createData('BET004', 'Pending', '2025-04-23 13:00', 0),
  createData('BET005', 'Won', '2025-04-23 14:00', 750),
  createData('BET006', 'Lost', '2025-04-23 15:00', -300),
];

const BetSessionComponent: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [sortField, setSortField] = React.useState<keyof BetData | ''>('');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [filteredData, setFilteredData] = React.useState<BetData[]>(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setPage(0); // Reset về trang 1 khi tìm kiếm
    const filtered = initialData.filter(
      (row) => row.code.toLowerCase().includes(value) || row.status.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (field: keyof BetData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    const newOrder: 'asc' | 'desc' = isAsc ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      if (field === 'profit') {
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
          Phiên cược hiện tại
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
          <Table stickyHeader aria-label="bet-session-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={sortField === column.id}
                        direction={sortField === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id as keyof BetData)}
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
                <TableRow hover tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button variant="outlined" size="small" onClick={() => handleViewDetail(row.code)}>
                            Xem chi tiết
                          </Button>
                        </TableCell>
                      );
                    }
                    const value = row[column.id as keyof BetData];
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

export default BetSessionComponent;
