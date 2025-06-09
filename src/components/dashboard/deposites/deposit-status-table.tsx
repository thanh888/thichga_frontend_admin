'use client';

import * as React from 'react';
import { DepositByStatusApi } from '@/services/dashboard/deposit-history.api';
import { DepositMethod } from '@/utils/enum/deposit-method.enum';
import { DepositModeEnum } from '@/utils/enum/deposit-mode.enum';
import { DepositStatusEnum } from '@/utils/enum/deposit-status.enum';
import { convertDateTimeVN } from '@/utils/functions/default-function';
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

import UpdateDepositStatusComponent from './update-deposit-status';

// Định nghĩa interface cho dữ liệu bảng
interface DepositHistoryFormData {
  userID: any;
  money: number;
  adminID: any;
  status: string;
  code: string;
  referenceCode: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
  mode: DepositModeEnum;
  method: DepositMethod;
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
  { id: 'code', label: 'Mã code', minWidth: 100, align: 'left' },
  { id: 'userID', label: 'Người tạo', minWidth: 150, align: 'left' },
  { id: 'referenceCode', label: 'Mã tự động', minWidth: 100, align: 'left' },
  {
    id: 'money',
    label: 'Số tiền (VND)',
    minWidth: 120,
    align: 'right',
    format: (value: number) => value.toLocaleString('vi-VN'),
  },
  { id: 'mode', label: 'Phương thức', minWidth: 150, align: 'left' },
  { id: 'status', label: 'Trạng thái', minWidth: 150, align: 'left' },
  { id: 'adminID', label: 'Quản trị viên', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Ngày tạo', minWidth: 150, align: 'left' },
  { id: 'updatedAt', label: 'Ngày cập nhật', minWidth: 150, align: 'left' },
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
  { id: 'feedback', label: 'Phản hồi', minWidth: 250, align: 'left' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const DepositStatusTable: React.FC<Props> = ({ isReload, setIsReload }) => {
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [mode, setMode] = React.useState<DepositModeEnum | any>(DepositModeEnum.MANUAL);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [sortField, setSortField] = React.useState<keyof DepositHistoryFormData>('createdAt');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [data, setData] = React.useState<{ docs: DepositHistoryFormData[]; totalDocs: number }>({
    docs: [],
    totalDocs: 0,
  });
  const [openDialog, setOpenDialog] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

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
      return DepositStatusEnum.PENDING;
    } else if (tab === 2) {
      return DepositStatusEnum.SUCCESS;
    } else {
      return DepositStatusEnum.REJECT;
    }
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const status = getStatus(tabValue) ?? DepositStatusEnum.PENDING;
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&status=${status}&sort=${sortQuery}&mode=${mode}`;
      const response = await DepositByStatusApi(query);
      if (response.status === 200 || response.status === 201) {
        setData({ ...response.data, docs: response.data.docs });
      } else {
        setData({ docs: [], totalDocs: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch deposit history:', error);
      setData({ docs: [], totalDocs: 0 });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchDeposits();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchDeposits();
  }, [tabValue, page, rowsPerPage, sortField, sortOrder, mode]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
    // Cập nhật mode tương ứng với tab
    if (newValue === 0) {
      setMode(DepositModeEnum.MANUAL);
    } else if (newValue === 1) {
      setMode(DepositModeEnum.AUTO);
    } else {
      setMode('');
    }
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
          <Tab label="Chờ xử lý(Thủ công)" />
          <Tab label="Chờ xử lý(Tự động)" />
          <Tab label="Thành công" />
          <Tab label="Đã từ chối" />
        </Tabs>

        <TableContainer sx={{ maxHeight: 560, overflowX: 'auto' }}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : data?.docs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                data?.docs?.map((row) => (
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
                      } else if (column.id === 'referenceCode') {
                        value = row?.referenceCode || '';
                      } else if (column.id === 'adminID') {
                        value = row?.adminID?.username || 'N/A';
                      } else if (column.id === 'mode') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Typography
                              variant="caption"
                              bgcolor={row.mode === DepositModeEnum.AUTO ? '#1de9b6' : '#e57373'}
                              sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16, whiteSpace: 'nowrap' }}
                            >
                              {row.mode === DepositModeEnum.AUTO ? 'Tự động' : `Thủ công(${row.method})`}
                            </Typography>
                          </TableCell>
                        );
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
                        value = convertDateTimeVN(row.createdAt);
                      } else if (column.id === 'updatedAt') {
                        value = convertDateTimeVN(row.updatedAt);
                      }

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
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

export default DepositStatusTable;
