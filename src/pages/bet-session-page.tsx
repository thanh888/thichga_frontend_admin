'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateBetHistoryApi } from '@/services/dashboard/bet-history.api';
import { BetHistoryStatusEnum } from '@/utils/enum/bet-history-status.enum';
import { BetResultEnum } from '@/utils/enum/bet-result.enum';
import { TeamEnum } from '@/utils/enum/team.enum';
import {
  convertDateTime,
  ConvertMoneyVND,
  listResultHistory,
  listStatusHistory,
} from '@/utils/functions/default-function';
import { BettingHistoryInterface } from '@/utils/interfaces/bet-history.interface';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import {
  Box,
  Button,
  Card,
  CircularProgress,
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

// Define interface for table columns
interface Column {
  id: keyof BettingHistoryInterface | 'odds' | 'userProfit';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number | undefined) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã cược', minWidth: 80, align: 'left' },
  { id: 'creatorID', label: 'Người đặt', minWidth: 100, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number | undefined) => (value != null ? value.toLocaleString('vi-VN') : 'N/A'),
  },
  {
    id: 'odds',
    label: 'Tỷ lệ cược',
    minWidth: 100,
    align: 'right',
  },
  { id: 'selectedTeam', label: 'Đội chọn', minWidth: 150, align: 'left' },
  { id: 'userResult', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'systemProfit', label: 'Kết quả', minWidth: 120, align: 'left' },
  { id: 'systemRevenue', label: 'Doanh thu', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Thời gian', minWidth: 120, align: 'center' },
];

interface Props {
  sessionId: string;
}

export default function SessionDetailPage({ sessionId }: Props): React.JSX.Element {
  const [bets, setBets] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ code: '', status: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof BettingHistoryInterface>('code');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');

  const router = useRouter();
  const sessionID = sessionId;

  const fetchBets = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!sessionID) {
        return;
      }
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page * rowsPerPage}&search=${filter.code}&status=${filter.status}&sort=${sortQuery}`;
      const response = await paginateBetHistoryApi(sessionID, query);
      if (response.status === 200 || response.status === 201) {
        setBets(response.data);
      } else {
        setError('Không thể tải lịch sử cược, vui lòng thử lại');
        alert('Không thể tải lịch sử cược, vui lòng thử lại');
      }
    } catch (err: any) {
      console.error('Failed to fetch bet history:', err);
      setError(err.response?.data?.message || 'Không thể tải lịch sử cược, vui lòng thử lại');
      alert(err.response?.data?.message || 'Không thể tải lịch sử cược, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBets();
  }, [filter, page, rowsPerPage, order, orderBy, sessionID]);

  const handleRequestSort = (property: keyof BettingHistoryInterface) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (code: string) => {
    router.push(`/bets/${code}`);
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => fetchBets()} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Card>
    );
  }

  // if (!bets?.docs?.length) {
  //   return (
  //     <Card sx={{ p: 2, textAlign: 'center' }}>
  //       <Typography>Không có cược nào để hiển thị</Typography>
  //     </Card>
  //   );
  // }

  return (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        Kết quả phiên #${sessionID}
      </Typography>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo mã cược"
          name="code"
          value={filter.code}
          onChange={handleFilterChange}
          size="small"
          sx={{ width: '50%' }}
        />
        <FormControl sx={{ width: '50%' }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select label="Trạng thái" name="status" value={filter.status} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            {listStatusHistory.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id as keyof BettingHistoryInterface)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bets?.docs?.map((row: BettingHistoryInterface) => (
              <TableRow hover key={row?._id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row?.code}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row?.creatorID?.username}</TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'money')?.format?.(row?.money) || row?.money}
                </TableCell>
                <TableCell align="right">
                  {row?.win}:{row?.lost}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row?.selectedTeam === TeamEnum.BLUE ? '#33bfff' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 14 }}
                  >
                    {row?.selectedTeam === TeamEnum.BLUE ? 'Gà xanh' : 'Gà đỏ'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row?.status === BetHistoryStatusEnum.MATCHED ? '#1de9b6' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 14 }}
                  >
                    {listResultHistory.find((item) => item.value === row.userResult)?.label || ''}
                  </Typography>
                </TableCell>
                <TableCell>{ConvertMoneyVND(row.userProfit ?? 0)}</TableCell>
                <TableCell>{ConvertMoneyVND(row?.systemRevenue ?? 0)} </TableCell>
                <TableCell>{convertDateTime(row?.createdAt?.toString() || '')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={bets?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
