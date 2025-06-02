'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { DepositByStatusApi } from '@/services/dashboard/deposit-history.api';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  Box,
  Button,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  Typography,
} from '@mui/material';

import UpdateDepositStatusComponent from '@/components/dashboard/deposites/update-deposit-status';

// Định nghĩa interface cho dữ liệu bảng
interface DepositHistoryFormData {
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  createdAt: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof DepositHistoryFormData | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'code', label: 'Mã giao dịch', minWidth: 100, align: 'left' },
  { id: 'userID', label: 'Người dùng', minWidth: 150, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  user_id: string;
}

const UserHitoryDepositsTable: React.FC<Props> = ({ user_id }) => {
  const [isReload, setIsReload] = React.useState<boolean>(true);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortField, setSortField] = React.useState<keyof DepositHistoryFormData>('code');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: DepositHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any>(null);

  const statusLabels: { [key in DepositStatusEnum]: string } = {
    [DepositStatusEnum.PENDING]: 'Chờ xử lý',
    [DepositStatusEnum.SUCCESS]: 'Thành công',
    [DepositStatusEnum.REJECT]: 'Đã từ chối',
  };

  // Get status from tab value
  const getStatus = (tab: number) => {
    if (tab === 0) {
      return DepositStatusEnum.PENDING;
    } else if (tab === 1) {
      return DepositStatusEnum.SUCCESS;
    } else {
      return DepositStatusEnum.REJECT;
    }
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    try {
      const status = getStatus(tabValue) ?? DepositStatusEnum.PENDING;
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&status=${status}&sort=${sortQuery}&mode=${DepositModeEnum.MANUAL}&user_id=${user_id}`;
      const response = await DepositByStatusApi(query);
      if (response.status === 200 || response.status === 201) {
        setData({ ...response.data, docs: response.data.docs });
      } else {
        setData({ docs: [], totalDocs: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
      setData({ docs: [], totalDocs: 0 });
    }
  };

  React.useEffect(() => {
    if (isReload && user_id) {
      fetchDeposits();
      setIsReload(false);
    }
  }, [isReload, user_id]);

  React.useEffect(() => {
    fetchDeposits();
  }, [tabValue, page, rowsPerPage, sortField, sortOrder]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  // Handle sorting
  const handleSort = (field: keyof DepositHistoryFormData) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Open dialog for status update
  const handleOpenDialog = (data: any) => {
    setOpenDialog(data);
  };

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
          Danh sách nạp tiền
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            px: 2,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 500,
              padding: '12px 24px',
              textTransform: 'none',
              color: '#555',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#1976d2',
              },
            },
            '& .Mui-selected': {
              backgroundColor: '#1976d2',
              color: '#fff !important',
              fontWeight: 600,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
              height: '4px',
              borderRadius: '2px',
            },
          }}
        >
          <Tab label="Chờ xử lý" />
          <Tab label="Thành công" />
          <Tab label="Đã từ chối" />
        </Tabs>

        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table stickyHeader aria-label="deposit-status-table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth, top: 0 }}>
                    {column.id !== 'action' ? (
                      <TableSortLabel
                        active={sortField === column.id}
                        direction={sortField === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id as keyof DepositHistoryFormData)}
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
              {data?.docs?.map((row) => (
                <TableRow hover tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            variant="outlined"
                            disabled={row.status !== DepositStatusEnum.PENDING}
                            size="small"
                            onClick={() => handleOpenDialog(row)}
                          >
                            <BorderColorIcon />
                          </Button>
                        </TableCell>
                      );
                    }
                    let value = row[column.id as keyof DepositHistoryFormData];
                    if (column.id === 'userID') {
                      value = row?.userID?.username || 'N/A';
                    } else if (column.id === 'adminID') {
                      value = row?.adminID?.username || 'N/A';
                    } else if (column.id === 'status') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography
                            variant="caption"
                            bgcolor={
                              row.status === DepositStatusEnum.SUCCESS
                                ? '#1de9b6'
                                : row.status === DepositStatusEnum.REJECT
                                  ? '#e57373'
                                  : '#bdbdbd'
                            }
                            sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                          >
                            {statusLabels[row.status as DepositStatusEnum] || row.status}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === 'createdAt') {
                      value = new Date(row.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
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
          count={data?.totalDocs}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UpdateDepositStatusComponent openDialog={openDialog} setOpenDialog={setOpenDialog} setIsReload={setIsReload} />
    </Box>
  );
};

export default UserHitoryDepositsTable;
