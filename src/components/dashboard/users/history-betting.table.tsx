'use client';

import * as React from 'react';
import { paginateBetHistoryApiByUser } from '@/services/dashboard/bet-history.api';
import { BetResultEnum } from '@/utils/enum/bet-result.enum';
import { TeamEnum } from '@/utils/enum/team.enum';
import { TypeBetRoomEnum } from '@/utils/enum/type-bet-room.enum';
import { convertDateTime, numberThousandFload } from '@/utils/functions/default-function';
import { BettingHistoryInterface } from '@/utils/interfaces/bet-history.interface';
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
  { id: 'betRoomID', label: 'Phòng cược', minWidth: 100, align: 'left' },
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
  { id: 'systemRevenue', label: 'Doanh thu  HT', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Thời gian', minWidth: 120, align: 'center' },
];

interface Props {
  user_id: string;
}

const listResultHistory = [
  { value: BetResultEnum.WIN, label: 'Thắng' },
  { value: BetResultEnum.LOSE, label: 'Thua' },
  { value: BetResultEnum.DRAW, label: 'Hòa' },
  { value: BetResultEnum.CANCEL, label: 'Hủy' },
  { value: BetResultEnum.REFUNDED, label: 'Hoàn tiền' },
];

export default function UserBettingHistoriesTable({ user_id }: Props): React.JSX.Element {
  const [bets, setBets] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ roomName: '', type: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof BettingHistoryInterface>('createdAt');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');

  const fetchBets = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!user_id) {
        return;
      }
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.roomName}&type=${filter.type}&sort=${sortQuery}`;
      const response = await paginateBetHistoryApiByUser(user_id, query);
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
  }, [filter, page, rowsPerPage, order, orderBy, user_id]);

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

  return (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        {/* Kết quả phiên #${user_id} */}
      </Typography>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo phòng cược"
          name="roomName"
          value={filter.roomName}
          onChange={handleFilterChange}
          size="small"
          sx={{ width: '50%' }}
        />
        <FormControl sx={{ width: '50%' }} size="small">
          <InputLabel>Loại phòng</InputLabel>
          <Select label="Loại phòng" name="type" value={filter.type} onChange={handleFilterChange}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value={TypeBetRoomEnum.NORMAL}>Truyền thống</MenuItem>
            <MenuItem value={TypeBetRoomEnum.SOLO}>Đối kháng</MenuItem>
            <MenuItem value={TypeBetRoomEnum.OTHER}>Gà đòn</MenuItem>
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
                <TableCell>{row?.betSessionID?.betRoomID?.roomName}</TableCell>
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
                    sx={{
                      p: 1,
                      borderRadius: '6px',
                      fontWeight: 500,
                      fontSize: 14,
                      bgcolor:
                        row?.userResult === BetResultEnum.WIN
                          ? '#38A169'
                          : row?.userResult === BetResultEnum.LOSE
                            ? '#ee7575'
                            : row?.userResult === BetResultEnum.DRAW
                              ? '#A0AEC0'
                              : '#A0AEC0',
                    }}
                  >
                    {row.userResult
                      ? listResultHistory.find((item: any) => item.value === row?.userResult)?.label
                      : 'Đang chờ'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {' '}
                  <Typography
                    variant="caption"
                    bgcolor={
                      row.userResult &&
                      [BetResultEnum.WIN, BetResultEnum.DRAW, BetResultEnum.CANCEL, BetResultEnum.REFUNDED].includes(
                        row.userResult
                      )
                        ? '#38A169'
                        : row.userResult === BetResultEnum.LOSE
                          ? '#ee7575'
                          : '#A0AEC0'
                    }
                    sx={{
                      p: 1,
                      borderRadius: '6px',
                      fontWeight: 500,
                      fontSize: 14,
                    }}
                  >
                    {row.userResult &&
                    [BetResultEnum.WIN, BetResultEnum.DRAW, BetResultEnum.CANCEL, BetResultEnum.REFUNDED].includes(
                      row.userResult
                    )
                      ? '+' + numberThousandFload(row?.userProfit ?? 0)
                      : row.userResult && [BetResultEnum.LOSE].includes(row.userResult)
                        ? '-' + numberThousandFload(row?.money ?? 0)
                        : 'Đang chờ'}
                  </Typography>
                </TableCell>
                <TableCell>{numberThousandFload(row?.systemRevenue ?? 0)} </TableCell>
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
