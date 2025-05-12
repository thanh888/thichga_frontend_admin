'use client';

import * as React from 'react';
import { getListReferralBy, paginateUserApi } from '@/services/dashboard/user.api';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Box,
  Button,
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

import EditUser from './update-user.dialog';

export interface UserFormData {
  _id: string;
  username: string;
  status: string;
  referrer: string;
  createdAt: string;
}

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UsersTable({ isReload, setIsReload }: Readonly<Props>): React.JSX.Element {
  const [accounts, setAccounts] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [filter, setFilter] = React.useState({ username: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof UserFormData>('username');
  const [openEdit, setOpenEdit] = React.useState<UserFormData | null>(null);

  const [listReferralBys, setListReferralBys] = React.useState<any[]>([]);

  const fetchAccounts = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.username}&sort=${sortQuery}`;
      const response = await paginateUserApi(query);

      if (response.status === 200 || response.status === 201) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchAccounts();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getListReferralBy();
        if (response.status === 200 || response.status === 201) {
          setListReferralBys(response.data);
        }
      } catch (error) {
        console.error('Error fetching referral list:', error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    fetchAccounts();
  }, [page, rowsPerPage, filter.username, order, orderBy]);

  const handleRequestSort = (property: keyof UserFormData) => {
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
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Trạng thái
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'referrer'}
                  direction={orderBy === 'referrer' ? order : 'asc'}
                  onClick={() => handleRequestSort('referrer')}
                >
                  Người giới thiệu
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Ngày tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.docs.map((row: UserFormData) => (
              <TableRow hover key={row._id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row.username}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.referrer}</TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOpenEdit(row)}>
                    <DriveFileRenameOutlineIcon />
                  </Button>
                  <Button variant="contained" color="success" sx={{ mr: 1 }}>
                    LS Cược
                  </Button>
                  <Button variant="contained" color="success" sx={{ mr: 1 }}>
                    Chuyển & Rút tiền
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
        count={accounts?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <EditUser
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        setIsReload={setIsReload}
        listReferralBys={listReferralBys}
      />
    </Card>
  );
}
