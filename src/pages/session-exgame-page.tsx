'use client';

import path from 'path';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateOptionByExGameeSessionApi, paginateOptionBySessionApi } from '@/services/dashboard/bet-option.api'; // Adjusted API
import { TeamEnum } from '@/utils/enum/team.enum';
import { convertDateTime } from '@/utils/functions/default-function';
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

// Define interface for table data
interface BetData {
  _id: string;
  code: string;
  makerID: any;
  win: number;
  lost: number;
  createdAt: string;
}

// Define interface for table columns
interface Column {
  id: keyof BetData | 'odds' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'code', label: 'Mã cược', minWidth: 100, align: 'left' },
  { id: 'makerID', label: 'Người tạo', minWidth: 100, align: 'left' },
  { id: 'odds', label: 'Tỉ lệ cược', minWidth: 100, align: 'left' },
  { id: 'createdAt', label: 'Thời gian tạo', minWidth: 150, align: 'left' },
  { id: 'action', label: '', minWidth: 150, align: 'left' },
];

interface Props {
  sessionId: string;
}

export default function SessionExGamePage(): React.JSX.Element {
  const [bets, setBets] = React.useState<{ docs: BetData[]; totalDocs: number }>({ docs: [], totalDocs: 0 });
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ code: '', selectedTeam: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof BetData>('code');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');

  const router = useRouter();
  const param = useParams();
  const sessionID = param?.id?.toString();

  const fetchBets = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (!sessionID) {
        return;
      }
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.code}&selectedTeam=${filter.selectedTeam}&sort=${sortQuery}`;
      const response = await paginateOptionByExGameeSessionApi(sessionID, query);
      if (response.status === 200 || response.status === 201) {
        setBets(response.data);
      } else {
        setError('Không thể tải danh sách cược, vui lòng thử lại');
      }
    } catch (err: any) {
      console.error('Failed to fetch bet options:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách cược, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBets();
  }, [filter, page, rowsPerPage, order, orderBy, sessionID]);

  const handleRequestSort = (property: keyof BetData) => {
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

  const handleViewDetail = (id: string) => {
    router.push(paths.dashboard.histories_exgame + `/${id}`);
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card>
      <Typography variant="h5" sx={{ marginTop: 1, marginLeft: 1 }}>
        Danh sách tất cả ls cược trong kèo #{sessionID}
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
      </Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id as keyof BetData)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bets?.docs?.map((row: BetData) => (
              <TableRow hover key={row.code}>
                <TableCell>
                  <Typography variant="subtitle2">{row.code}</Typography>
                </TableCell>
                <TableCell>{row?.makerID?.username}</TableCell>
                <TableCell>
                  <TableCell>
                    <Typography component="span" fontWeight={600} fontSize={20} color="blue">
                      {row.lost}
                    </Typography>
                    :
                    <Typography component="span" fontWeight={600} fontSize={20} color="red">
                      {row.win}
                    </Typography>
                  </TableCell>
                </TableCell>

                <TableCell>{convertDateTime(row.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleViewDetail(row._id)}>
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
