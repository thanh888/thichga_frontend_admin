'use client';

import * as React from 'react';
import {
  Box,
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
  maker_name: string;
  money: number;
  odd: number;
  selected_team: string;
  matcher_name: string;
  status: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BetData;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã (Code)', minWidth: 80, align: 'left' },
  { id: 'maker_name', label: 'Tên người đặt', minWidth: 150, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'left',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  {
    id: 'odd',
    label: 'Tỷ lệ cược',
    minWidth: 100,
    align: 'left',
    format: (value: number) => value.toFixed(2),
  },
  { id: 'selected_team', label: 'Đội chọn', minWidth: 120, align: 'left' },
  { id: 'matcher_name', label: 'Khớp kèo', minWidth: 120, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 100, align: 'left' },
];

// Hàm tạo dữ liệu mẫu
function createData(
  code: string,
  maker_name: string,
  money: number,
  odd: number,
  selected_team: string,
  matcher_name: string,
  status: string
): BetData {
  return { code, maker_name, money, odd, selected_team, matcher_name, status };
}

const initialData: BetData[] = [
  createData('BET001', 'John Doe', 1000, 1.5, 'Team A', 'Nguyen B', 'Pending'),
  createData('BET002', 'Jane Smith', 2000, 2.0, 'Team B', 'Nguyen B', 'Won'),
  createData('BET003', 'Mike Wilson', 1500, 1.8, 'Team A', 'Nguyen B', 'Lost'),
  createData('BET004', 'Alice Brown', 3000, 1.7, 'Team C', 'Nguyen B', 'Pending'),
  createData('BET005', 'Bob Johnson', 1200, 2.1, 'Team B', 'Nguyen B', 'Won'),
  createData('BET006', 'Emma Davis', 1800, 1.9, 'Team A', 'Nguyen B', 'Lost'),
];

const BetHistoryComponent: React.FC = () => {
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
      (row) =>
        row.code.toLowerCase().includes(value) ||
        row.maker_name.toLowerCase().includes(value) ||
        row.selected_team.toLowerCase().includes(value) ||
        row.matcher_name.toLowerCase().includes(value) ||
        row.status.toLowerCase().includes(value)
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
      if (field === 'money' || field === 'odd') {
        return newOrder === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      return newOrder === 'asc' ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
    });
    setFilteredData(sortedData);
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

  // Hàm render bảng
  const renderTable = (title: string, tableId: string) => (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TextField
        label="Tìm kiếm"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label={`table-${tableId}`}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                  <TableSortLabel
                    active={sortField === column.id}
                    direction={sortField === column.id ? sortOrder : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  const value = row[column.id];
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
    </>
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      {/* Box 1: Phiên cược hiện tại */}
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
        <Paper sx={{ width: '100%' }}>{renderTable('Phiên cược hiện tại', '1')}</Paper>
      </Box>

      {/* Box 2: Thông tin cược khác */}
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
        <Paper sx={{ width: '100%' }}>{renderTable('Thông tin cược khác', '2')}</Paper>
      </Box>
    </Box>
  );
};

export default BetHistoryComponent;
