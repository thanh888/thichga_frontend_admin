'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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

import EditRoom from './update-room.dialog';

// Updated RoomFormData interface
export interface RoomFormData {
  id: string;
  name: string;
  type_room: string;
  status_session: string;
  status_bet: string;
  created_at: string;
}

interface RoomsTableProps {
  count?: number;
  page?: number;
  rows?: RoomFormData[];
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleBetStatus?: (id: string) => void; // Updated callback for toggling status_bet
}

export function RoomsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  onToggleBetStatus = () => {},
}: Readonly<RoomsTableProps>): React.JSX.Element {
  const router = useRouter();
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof RoomFormData>('name');
  const [filter, setFilter] = React.useState({ name: '', type_room: '', status_session: '' });
  const [openEdit, setOpenEdit] = React.useState<RoomFormData | null>(null);

  const handleRequestSort = (property: keyof RoomFormData) => {
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
    const comparator = (a: RoomFormData, b: RoomFormData) => {
      if (orderBy === 'name' || orderBy === 'type_room' || orderBy === 'status_session' || orderBy === 'created_at') {
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
      const matchesName = row.name.toLowerCase().includes(filter.name.toLowerCase());
      const matchesTypeRoom = filter.type_room ? row.type_room === filter.type_room : true;
      const matchesStatusSession = filter.status_session ? row.status_session === filter.status_session : true;
      return matchesName && matchesTypeRoom && matchesStatusSession;
    });
  }, [sortedRows, filter]);

  // Paginate the filtered rows
  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField label="Tìm theo tên" name="name" value={filter.name} onChange={handleFilterChange} size="small" />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Loại phòng</InputLabel>
          <Select label="Loại phòng" name="type_room" value={filter.type_room} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Premium">Premium</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Trạng thái phiên</InputLabel>
          <Select
            label="Trạng thái phiên"
            name="status_session"
            value={filter.status_session}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Không hoạt động</MenuItem>
            <MenuItem value="pending">Đang chờ</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Tên
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'type_room'}
                  direction={orderBy === 'type_room' ? order : 'asc'}
                  onClick={() => handleRequestSort('type_room')}
                >
                  Loại phòng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status_session'}
                  direction={orderBy === 'status_session' ? order : 'asc'}
                  onClick={() => handleRequestSort('status_session')}
                >
                  Trạng thái phiên
                </TableSortLabel>
              </TableCell>
              <TableCell>Trạng thái cược</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'created_at'}
                  direction={orderBy === 'created_at' ? order : 'asc'}
                  onClick={() => handleRequestSort('created_at')}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.type_room}</TableCell>
                <TableCell>{row.status_session}</TableCell>
                <TableCell>{row.status_bet}</TableCell>
                <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => router.push(`rooms/${row.id}`)}
                  >
                    Chi tiết
                  </Button>
                  <Button variant="contained" color="error">
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditRoom openEdit={openEdit} setOpenEdit={setOpenEdit} />
    </Card>
  );
}
