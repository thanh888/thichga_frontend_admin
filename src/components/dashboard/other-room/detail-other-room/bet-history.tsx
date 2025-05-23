'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateBetHistoryApi } from '@/services/dashboard/bet-history.api';
import { BetHistoryStatusEnum } from '@/utils/enum/bet-history-status.enum';
import { TeamEnum } from '@/utils/enum/team.enum';
import { convertDateTime, listStatusHistory } from '@/utils/functions/default-function';
import { BettingHistoryInterface } from '@/utils/interfaces/bet-history.interface';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import {
  Box,
  Card,
  Divider,
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

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BettingHistoryInterface | 'action' | 'odds';
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
  { id: 'matchedUserId', label: 'Khớp kèo', minWidth: 120, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Thời gian', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  sessionID: string;
  room: BettingRoomInterface;
}

export function BetHistoryComponent({ isReload, sessionID, room }: Readonly<Props>): React.JSX.Element {
  // State cho bảng "Phiên cược hiện tại"
  const [currentSessions, setCurrentSessions] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = React.useState<number>(10);
  const [currentFilter, setCurrentFilter] = React.useState({ code: '', status: '' });
  const [currentOrder, setCurrentOrder] = React.useState<'asc' | 'desc'>('asc');
  const [currentOrderBy, setCurrentOrderBy] = React.useState<keyof BettingHistoryInterface>('code');

  // State cho bảng "Thông tin cược khác"
  const [otherBets, setOtherBets] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [otherPage, setOtherPage] = React.useState<number>(0);
  const [otherRowsPerPage, setOtherRowsPerPage] = React.useState<number>(10);
  const [otherFilter, setOtherFilter] = React.useState({ code: '', status: '' });
  const [otherOrder, setOtherOrder] = React.useState<'asc' | 'desc'>('asc');
  const [otherOrderBy, setOtherOrderBy] = React.useState<keyof BettingHistoryInterface>('code');

  const router = useRouter();

  const fetchBets = async (
    isCurrent: boolean,
    filter: { code: string; status: string },
    page: number,
    rowsPerPage: number,
    order: 'asc' | 'desc',
    orderBy: keyof BettingHistoryInterface,
    selectedTeam: string
  ) => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.code}&status=${filter.status}&isCurrent=${isCurrent}&sort=${sortQuery}&selectedTeam=${selectedTeam}`;
      const response = await paginateBetHistoryApi(sessionID, query);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      return { docs: [], totalDocs: 0 };
    } catch (error) {
      console.error('Failed to fetch bet history:', error);
      return { docs: [], totalDocs: 0 };
    }
  };

  React.useEffect(() => {
    if (isReload) {
      Promise.all([
        fetchBets(true, currentFilter, currentPage, currentRowsPerPage, currentOrder, currentOrderBy, 'RED'),
        fetchBets(false, otherFilter, otherPage, otherRowsPerPage, otherOrder, otherOrderBy, 'BLUE'),
      ]).then(([current, other]) => {
        setCurrentSessions(current);
        setOtherBets(other);
      });
    }
  }, [isReload]);

  React.useEffect(() => {
    Promise.all([
      fetchBets(true, currentFilter, currentPage, currentRowsPerPage, currentOrder, currentOrderBy, 'RED'),
      fetchBets(false, otherFilter, otherPage, otherRowsPerPage, otherOrder, otherOrderBy, 'BLUE'),
    ]).then(([current, other]) => {
      setCurrentSessions(current);
      setOtherBets(other);
    });
  }, [
    currentFilter,
    currentPage,
    currentRowsPerPage,
    currentOrder,
    currentOrderBy,
    otherFilter,
    otherPage,
    otherRowsPerPage,
    otherOrder,
    otherOrderBy,
  ]);

  const handleRequestSort = (property: keyof BettingHistoryInterface, isCurrent: boolean) => {
    if (isCurrent) {
      const isAsc = currentOrderBy === property && currentOrder === 'asc';
      setCurrentOrder(isAsc ? 'desc' : 'asc');
      setCurrentOrderBy(property);
    } else {
      const isAsc = otherOrderBy === property && otherOrder === 'asc';
      setOtherOrder(isAsc ? 'desc' : 'asc');
      setOtherOrderBy(property);
    }
  };

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
    isCurrent: boolean
  ) => {
    const { name, value } = event.target;
    if (isCurrent) {
      setCurrentFilter((prev) => ({ ...prev, [name]: value }));
      setCurrentPage(0);
    } else {
      setOtherFilter((prev) => ({ ...prev, [name]: value }));
      setOtherPage(0);
    }
  };

  const handleChangePage = (_: unknown, newPage: number, isCurrent: boolean) => {
    if (isCurrent) {
      setCurrentPage(newPage);
    } else {
      setOtherPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isCurrent: boolean
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (isCurrent) {
      setCurrentRowsPerPage(newRowsPerPage);
      setCurrentPage(0);
    } else {
      setOtherRowsPerPage(newRowsPerPage);
      setOtherPage(0);
    }
  };

  const handleViewDetail = (code: string) => {
    router.push(`/bets/${code}`);
  };

  const renderTable = (
    title: string,
    tableId: string,
    data: any,
    filter: { code: string; status: string },
    page: number,
    rowsPerPage: number,
    order: 'asc' | 'desc',
    orderBy: keyof BettingHistoryInterface,
    isCurrent: boolean
  ) => (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        {title}
      </Typography>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Tìm theo tên"
          name="code"
          value={filter.code}
          onChange={(e) => handleFilterChange(e, isCurrent)}
          size="small"
          sx={{ width: '50%' }}
        />
        {/* <FormControl sx={{ width: '50%' }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            name="status"
            value={filter.status}
            onChange={(e) => handleFilterChange(e, isCurrent)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {listStatusHistory.map((item, index) => (
              <MenuItem key={index} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
                    onClick={() => handleRequestSort(column.id as keyof BettingHistoryInterface, isCurrent)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.docs?.map((row: BettingHistoryInterface) => (
              <TableRow
                hover
                key={row?._id}
                // onClick={() => handleViewDetail(row?._id)}
              >
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
                  {row?.win}
                  {' : '}
                  {row?.lost}
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row?.selectedTeam === TeamEnum.BLUE ? '#33bfff' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 14 }}
                  >
                    {row?.selectedTeam === TeamEnum.BLUE ? room.blueName : room.redName}
                  </Typography>
                </TableCell>
                <TableCell>{row?.matchedUserId?.username ?? row?.betOptionID?.code}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row?.status === BetHistoryStatusEnum.MATCHED ? '#1de9b6' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 14 }}
                  >
                    {listStatusHistory.find((item) => item.value === row.status)?.label || ''}
                  </Typography>
                </TableCell>
                <TableCell>{convertDateTime(row?.createdAt?.toString() || '')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={data?.totalDocs || 0}
        page={page}
        onPageChange={(_: unknown, newPage: number) => handleChangePage(_, newPage, isCurrent)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, isCurrent)}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ flex: 1, py: 1, px: 1, mt: 4, overflow: 'auto' }}>
        {renderTable(
          `Phiên cược hiện tại (${room.redName})`,
          'current',
          currentSessions,
          currentFilter,
          currentPage,
          currentRowsPerPage,
          currentOrder,
          currentOrderBy,
          true
        )}
      </Box>
      <Box sx={{ flex: 1, py: 1, px: 1, mt: 4, overflow: 'auto' }}>
        {renderTable(
          `Phiên cược hiện tại (${room.blueName})`,
          'other',
          otherBets,
          otherFilter,
          otherPage,
          otherRowsPerPage,
          otherOrder,
          otherOrderBy,
          false
        )}
      </Box>
    </Box>
  );
}

export default BetHistoryComponent;
