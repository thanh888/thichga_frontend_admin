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
  Typography,
} from '@mui/material';

// Định nghĩa interface cho dữ liệu bảng
interface BannerFormData {
  image_url: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BannerFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'image_url', label: 'Image URL', minWidth: 200, align: 'left' },
  { id: 'action', label: 'Action', minWidth: 120, align: 'center' },
];

// Hàm tạo dữ liệu mẫu
function createData(image_url: string): BannerFormData {
  return { image_url };
}

const initialData: BannerFormData[] = [
  createData('https://example.com/images/banner1.jpg'),
  createData('https://example.com/images/banner2.jpg'),
  createData('https://example.com/images/banner3.jpg'),
  createData('https://example.com/images/banner4.jpg'),
  createData('https://example.com/images/banner5.jpg'),
  createData('https://example.com/images/banner6.jpg'),
];

const BannerTable: React.FC = () => {
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  // Hàm xử lý khi nhấp nút "Xem chi tiết"
  const handleViewDetail = (image_url: string) => {
    // Thay bằng logic thực tế (ví dụ: mở modal, chuyển hướng)
    alert(`View details for image: ${image_url}`);
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
          Danh sách tất cả banner
        </Typography>
        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="banner-table">
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
              {initialData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button variant="outlined" size="small" onClick={() => handleViewDetail(row.image_url)}>
                            Delete
                          </Button>
                        </TableCell>
                      );
                    }
                    const value = row[column.id as keyof BannerFormData];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <img src={value} />
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
          count={initialData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default BannerTable;
