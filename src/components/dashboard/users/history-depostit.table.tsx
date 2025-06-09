'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
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
  TextField,
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
      return DepositStatusEnum.SUCCESS;
    } else {
      return DepositStatusEnum.REJECT;
    }
  };

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Fetch data using API
  const fetchDeposits = async () => {
    try {
      const status = getStatus(tabValue) ?? DepositStatusEnum.PENDING;
      const sortQuery = sortOrder === 'asc' ? sortField : `-${sortField}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&status=${status}&sort=${sortQuery}&mode=${DepositModeEnum.MANUAL}&user_id=${user_id}&search=${encodeURIComponent(searchTerm)}`;
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
  }, [tabValue, page, rowsPerPage, sortField, sortOrder, searchTerm]);

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
        <TextField
          label="Tìm kiếm"
          placeholder="Tìm theo mã, nội dung..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          sx={{ my: 2 }}
        />
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
                data?.docs?.map((row) => {
                  // Extracted logic for status background color
                  const getStatusBgColor = (status: DepositStatusEnum) => {
                    if (status === DepositStatusEnum.SUCCESS) return '#1de9b6';
                    if (status === DepositStatusEnum.REJECT) return '#e57373';
                    return '#bdbdbd';
                  };

                  // Extracted logic for rendering cell content
                  const renderCell = (column: Column) => {
                    switch (column.id) {
                      case 'action':
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
                      case 'userID':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row?.userID?.username ?? 'N/A'}
                          </TableCell>
                        );
                      case 'referenceCode':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row?.referenceCode ?? ''}
                          </TableCell>
                        );
                      case 'adminID':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row?.adminID?.username ?? 'N/A'}
                          </TableCell>
                        );
                      case 'mode':
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
                      case 'status':
                        const statusBgColor = getStatusBgColor(row.status as DepositStatusEnum);
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Typography
                              variant="caption"
                              bgcolor={statusBgColor}
                              sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                            >
                              {statusLabels[row.status as DepositStatusEnum] ?? row.status}
                            </Typography>
                          </TableCell>
                        );
                      case 'createdAt':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {convertDateTimeVN(row.createdAt)}
                          </TableCell>
                        );
                      case 'updatedAt':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {convertDateTimeVN(row.updatedAt)}
                          </TableCell>
                        );
                      case 'money':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof row.money === 'number' ? column.format(row.money) : row.money}
                          </TableCell>
                        );
                      case 'feedback':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row?.feedback ?? ''}
                          </TableCell>
                        );
                      case 'code':
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row?.code ?? ''}
                          </TableCell>
                        );
                      default:
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {row[column.id as keyof DepositHistoryFormData]}
                          </TableCell>
                        );
                    }
                  };

                  return (
                    <TableRow hover tabIndex={-1} key={row.code}>
                      {columns.map((column) => renderCell(column))}
                    </TableRow>
                  );
                })
              )}
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
