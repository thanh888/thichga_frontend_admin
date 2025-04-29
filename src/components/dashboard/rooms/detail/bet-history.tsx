'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateBetHistoryApi } from '@/services/dashboard/bet-history';
import { BetHistoryStatusEnum } from '@/utils/enum/bet-history-status.enum';
import { listStatusHistory } from '@/utils/functions/default-function';
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

// Định nghĩa interface cho dữ liệu bảng
interface BetData {
  code: string;
  creatorID: any;
  money: number;
  red_odds: number;
  blue_odds: number;
  selectedTeam: string;
  matchedUserId: any;
  status: string;
  createdAt: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BetData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number | undefined) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã cược', minWidth: 80, align: 'left' },
  { id: 'creatorID', label: 'Người đặt', minWidth: 120, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number | undefined) => (value != null ? value.toLocaleString('vi-VN') : 'N/A'),
  },
  {
    id: 'red_odds',
    label: 'Tỷ lệ đỏ',
    minWidth: 100,
    align: 'right',
    format: (value: number | undefined) => (value != null ? value.toFixed(2) : 'N/A'),
  },
  {
    id: 'blue_odds',
    label: 'Tỷ lệ xanh',
    minWidth: 100,
    align: 'right',
    format: (value: number | undefined) => (value != null ? value.toFixed(2) : 'N/A'),
  },
  { id: 'selectedTeam', label: 'Đội chọn', minWidth: 120, align: 'left' },
  { id: 'matchedUserId', label: 'Khớp kèo', minWidth: 120, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Thời gian', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BetHistoryComponent(): React.JSX.Element {
  const [isReload, setIsReload] = React.useState<boolean>(true);

  // State cho bảng "Phiên cược hiện tại"
  const [currentSessions, setCurrentSessions] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = React.useState<number>(10);
  const [currentFilter, setCurrentFilter] = React.useState({ code: '', status: '' });
  const [currentOrder, setCurrentOrder] = React.useState<'asc' | 'desc'>('asc');
  const [currentOrderBy, setCurrentOrderBy] = React.useState<keyof BetData>('code');

  // State cho bảng "Thông tin cược khác"
  const [otherBets, setOtherBets] = React.useState<any>({ docs: [], totalDocs: 0 });
  const [otherPage, setOtherPage] = React.useState<number>(0);
  const [otherRowsPerPage, setOtherRowsPerPage] = React.useState<number>(10);
  const [otherFilter, setOtherFilter] = React.useState({ code: '', status: '' });
  const [otherOrder, setOtherOrder] = React.useState<'asc' | 'desc'>('asc');
  const [otherOrderBy, setOtherOrderBy] = React.useState<keyof BetData>('code');

  const params = useParams<{ id: string }>();
  const id = params?.id || '';
  const router = useRouter();

  const fetchBets = async (
    isCurrent: boolean,
    filter: { code: string; status: string },
    page: number,
    rowsPerPage: number,
    order: 'asc' | 'desc',
    orderBy: keyof BetData,
    selectedTeam: string
  ) => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page * rowsPerPage}&search=${filter.code}&status=${filter.status}&isCurrent=${isCurrent}&sort=${sortQuery}&selectedTeam=${selectedTeam}`;
      const response = await paginateBetHistoryApi(id, query);
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
        setIsReload(false);
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

  const handleRequestSort = (property: keyof BetData, isCurrent: boolean) => {
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
    orderBy: keyof BetData,
    isCurrent: boolean
  ) => (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        {title}
      </Typography>
      <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        {/* <TextField
          label="Tìm theo mã cược"
          name="code"
          value={filter.code}
          onChange={(e) => handleFilterChange(e, isCurrent)}
          size="small"
          sx={{ width: '100%' }}
        /> */}

        {/* <FormControl sx={{ width: '100%' }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            name="status"
            value={filter.status}
            onChange={(e) => handleFilterChange(e, isCurrent)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {listStatusHistory.map((item, index) => (
              <MenuItem key={+index} value={item.value}>
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
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.docs?.map((row: BetData) => (
              <TableRow hover key={row?.code}>
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
                  {columns.find((col) => col.id === 'red_odds')?.format?.(row?.red_odds) || row?.red_odds}
                </TableCell>
                <TableCell align="right">
                  {columns.find((col) => col.id === 'blue_odds')?.format?.(row?.blue_odds) || row?.blue_odds}
                </TableCell>
                <TableCell>{row?.selectedTeam}</TableCell>
                <TableCell>{row?.matchedUserId?.username}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row?.status === BetHistoryStatusEnum.MATCHED ? '#1de9b6' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 14 }}
                  >
                    {listStatusHistory.find((item) => item.value === row.status)?.label || ''}
                  </Typography>
                </TableCell>
                <TableCell>{row?.createdAt}</TableCell>
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
          'Phiên cược hiện tại',
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
          'Phiên cược hiện tại',
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
