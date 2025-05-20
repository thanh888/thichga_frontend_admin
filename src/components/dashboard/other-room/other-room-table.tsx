'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteRoomById,
  deleteSoftRoomById,
  paginateBetRoomApi,
  paginateOtherBetRoomApi,
} from '@/services/dashboard/bet-room.api';
import { TypeBetRoomEnum } from '@/utils/enum/type-bet-room.enum';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { toast } from 'react-toastify';

export interface RoomFormData {
  _id: string;
  roomName: string;
  typeRoom: string;
  isOpened: boolean;
  isAcceptBetting?: boolean;
  createdAt: string;
}

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function OtherRoomsTable({ isReload, setIsReload }: Readonly<Props>): React.JSX.Element {
  const [rooms, setRooms] = React.useState<any>(null);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [filter, setFilter] = React.useState({ roomName: '', typeRoom: '', isOpened: '' });
  const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof RoomFormData>('createdAt');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [roomToDelete, setRoomToDelete] = React.useState<RoomFormData | null>(null);

  const router = useRouter();

  const fetchRooms = async () => {
    try {
      const sortQuery = order === 'asc' ? orderBy : `-${orderBy}`;
      const query = `limit=${rowsPerPage}&skip=${page + 1}&search=${filter.roomName}&typeRoom=${filter.typeRoom}&isOpened=${filter.isOpened}&sort=${sortQuery}&isDeleted=false`;
      const response = await paginateOtherBetRoomApi(query);
      if (response.status === 200 || response.status === 201) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      const response = await deleteSoftRoomById(roomToDelete._id);
      if (response.status === 200 || response.status === 204) {
        fetchRooms(); // Refresh the table
        setDeleteDialogOpen(false);
        setRoomToDelete(null);
        toast.success('Xóa thành công');
      } else {
        toast.error('Không thể xóa phòng, vui lòng thử lại');
      }
    } catch (err: any) {
      console.error('Failed to delete room:', err);
    }
  };

  const handleOpenDeleteDialog = (room: RoomFormData) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  React.useEffect(() => {
    if (isReload) {
      fetchRooms();
      setIsReload(false);
    }
  }, [isReload]);

  React.useEffect(() => {
    fetchRooms();
  }, [page, rowsPerPage, filter, order, orderBy]);

  const handleRequestSort = (property: keyof RoomFormData) => {
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
          label="Tìm theo tên phòng"
          name="roomName"
          value={filter.roomName}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Trạng thái phòng</InputLabel>
          <Select label="Trạng thái phòng" name="isOpened" value={filter.isOpened} onChange={handleFilterChange}>
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'roomName'}
                  direction={orderBy === 'roomName' ? order : 'asc'}
                  onClick={() => handleRequestSort('roomName')}
                >
                  Tên phòng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'typeRoom'}
                  direction={orderBy === 'typeRoom' ? order : 'asc'}
                  onClick={() => handleRequestSort('typeRoom')}
                >
                  Loại phòng
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isOpened'}
                  direction={orderBy === 'isOpened' ? order : 'asc'}
                  onClick={() => handleRequestSort('isOpened')}
                >
                  Trạng thái phòng
                </TableSortLabel>
              </TableCell>
              <TableCell>Trạng thái cược</TableCell>
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
            {rooms?.docs?.map((row: RoomFormData) => (
              <TableRow hover key={row._id}>
                <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Typography variant="subtitle2">{row.roomName}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.typeRoom}</TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row.isOpened ? '#1de9b6' : '#e57373'}
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                  >
                    {row.isOpened ? 'Mở' : 'Đóng'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="caption"
                    bgcolor={row.isAcceptBetting ? '#1de9b6' : '#e57373'}
                    noWrap
                    sx={{ p: 1, borderRadius: 1, fontWeight: 500, fontSize: 16 }}
                  >
                    {row.isAcceptBetting ? 'Cho phép' : 'Không cho phép'}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => router.push(`other-room/${row._id}`)}
                  >
                    Chi tiết
                  </Button>
                  {/* <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOpenEdit(row)}>
                    <DriveFileRenameOutlineIcon />
                  </Button> */}
                  <Button variant="contained" color="error" onClick={() => handleOpenDeleteDialog(row)}>
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
        count={rooms?.totalDocs || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa phòng</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa phòng "{roomToDelete?.roomName}"? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteRoom} color="error" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
