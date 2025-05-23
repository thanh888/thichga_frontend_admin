'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateBetSessionApi } from '@/services/dashboard/bet-session.api';
import { convertDateTime } from '@/utils/functions/default-function';
import { BettingSessionInterface } from '@/utils/interfaces/bet-sesion.interface';
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

import { paths } from '@/paths';

// Định nghĩa interface cho dữ liệu bảng
interface Betsession {
  code: string;
  isOpened: boolean;
  createdAt: string;
  revenue: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof Betsession | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã cược', minWidth: 100, align: 'left' },
  { id: 'isOpened', label: 'Trạng thái', minWidth: 100, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  {
    id: 'revenue',
    label: 'Doanh thu (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: string) => parseFloat(value).toLocaleString('vi-VN'),
  },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BetSessionComponent({ isReload, setIsReload }: Readonly<Props>): React.JSX.Element {
  const [sessions, setSessions] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ code: '', isOpened: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Betsession>('createdAt');

  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const router = useRouter();

  const fetchSessions = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.code}&isOpened=${filter.isOpened}&sort=${sortQuery}`;
      const response = await paginateBetSessionApi(id, query); // Assumed adapted for bet sessions
      if (response.status === 200 || response.status === 201) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch bet sessions:', error);
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchSessions();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchSessions();
  }, [page, rowsPerPage, filter, order, orderBy]);

  const handleRequestSort = (property: keyof Betsession) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(0); // Reset to first page when filtering
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleViewDetail = (id: string) => {
    router.push(`${paths.dashboard.sessions}/${id}`); // Navigate to session detail page
  };

  const handleDelete = (code: string) => {
    // Placeholder for delete functionality
    console.log(`Delete session with code: ${code}`);
    setIsReload(true); // Trigger reload after delete
  };

  return (
    <Card>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo mã phiên"
          name="code"
          value={filter.code}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Trạng thái phiên</InputLabel>
          <Select label="Trạng thái phiên" name="isOpened" value={filter.isOpened} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Mở</MenuItem>
            <MenuItem value="false">Đóng</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.id !== 'action' ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id as keyof Betsession)}
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
            {sessions?.docs?.map((row: BettingSessionInterface) => (
              <TableRow hover key={row.code}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row.code}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row.isOpened ? '#1de9b6' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                  >
                    {row.isOpened ? 'Mở' : 'Đóng'}
                  </Typography>
                </TableCell>
                <TableCell>{convertDateTime(row?.createdAt?.toString() ?? '')}</TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'revenue')?.format?.(row?.revenue?.toString() ?? '')}
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleViewDetail(row._id)}>
                    Chi tiết
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
        count={sessions?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

export default BetSessionComponent;
