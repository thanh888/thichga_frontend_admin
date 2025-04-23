'use client';

import * as React from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';

import EditAdmin from './update-admin.dialog';

// Styled Switch (like the "YES" toggle from your image)

export interface AdminFormData {
  id: string;
  username: string;
  code: string;
  role: string;
  isActive?: boolean; // Added isActive field for toggle
}

interface AdminsTableProps {
  count?: number;
  page?: number;
  rows?: AdminFormData[];
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleActive?: (id: string) => void; // Callback for toggling active status
}

export function AdminsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  onToggleActive = () => {},
}: Readonly<AdminsTableProps>): React.JSX.Element {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof AdminFormData>('username');
  const [filter, setFilter] = React.useState({ username: '', role: '' });

  const [openEdit, setOpenEdit] = React.useState<any>(null);

  const handleRequestSort = (property: keyof AdminFormData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    if (name) {
      setFilter((prev) => ({ ...prev, [name]: value }));
    }
  };

  const sortedRows = React.useMemo(() => {
    const comparator = (a: AdminFormData, b: AdminFormData) => {
      if (orderBy === 'username' || orderBy === 'role') {
        const aValue = a[orderBy].toLowerCase();
        const bValue = b[orderBy].toLowerCase();
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0;
    };
    return [...rows].sort(comparator);
  }, [rows, order, orderBy]);

  const filteredRows = React.useMemo(() => {
    return sortedRows.filter((row) => {
      const matchesUsername = row.username.toLowerCase().includes(filter.username.toLowerCase());
      const matchesRole = filter.role ? row.role === filter.role : true;
      return matchesUsername && matchesRole;
    });
  }, [sortedRows, filter]);

  // Paginate the filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo tên đăng nhập"
          name="username"
          value={filter.username}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Chức vụ</InputLabel>
          <Select label="Chức vụ" name="role" value={filter.role} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            {states.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={orderBy === 'username' ? order : 'asc'}
                  onClick={() => handleRequestSort('username')}
                >
                  Tên đăng nhập
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'role'}
                  direction={orderBy === 'role' ? order : 'asc'}
                  onClick={() => handleRequestSort('role')}
                >
                  Chức vụ
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              return (
                <TableRow hover key={row.id}>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row.username}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>

                  <TableCell>
                    <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOpenEdit(row)}>
                      <DriveFileRenameOutlineIcon />
                    </Button>
                    <Button variant="contained" color="error">
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length} // Update count to reflect filtered rows
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditAdmin openEdit={openEdit} setOpenEdit={setOpenEdit} />
    </Card>
  );
}

// Role options for filtering
const states = [
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'PAYMENT_MANAGER', label: 'Nhân viên quản lý nạp rút' },
  { value: 'ROOM_MANAGER', label: 'Nhân viên quản lý phòng' },
] as const;
