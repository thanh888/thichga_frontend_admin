'use client';

import * as React from 'react';
import { findAllBetHistoryBySessionApi } from '@/services/dashboard/bet-history.api';
import { createBetOption } from '@/services/dashboard/bet-option.api';
import { TeamEnum } from '@/utils/enum/team.enum';
import { convertDateTime } from '@/utils/functions/default-function';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

import { useSocket } from '@/hooks/socket';
import { useUser } from '@/hooks/use-user';

// Định nghĩa interface cho dữ liệu bảng
interface BetData {
  code: string;
  win: number;
  lost: number;
  selectedTeam: string;
  createdAt: string;
}

// Định nghĩa interface cho cột bảng
interface Column {
  id: keyof BetData | 'odds' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'code', label: 'Mã cược', minWidth: 100, align: 'left' },
  { id: 'odds', label: 'Tỉ lệ cược', minWidth: 100, align: 'left' },
  { id: 'selectedTeam', label: 'Chọn', minWidth: 150, align: 'left' },
  { id: 'createdAt', label: 'Thời gian tạo', minWidth: 150, align: 'left' },
  // { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

export function BetOptionOtherComponent({ room }: Readonly<{ room: BettingRoomInterface }>): React.JSX.Element {
  const [isReload, setIsReload] = React.useState<boolean>(true);
  const socket = useSocket();

  const [bets, setBets] = React.useState<BetData[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    win: '10',
    lost: '10',
    selectedTeam: '',
  });

  const oddsOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

  const fetchBets = async (session_id: string) => {
    if (!session_id) {
      return;
    }
    try {
      const response = await findAllBetHistoryBySessionApi(session_id, '');
      if (response.status === 200 || response.status === 201) {
        // Transform creatorID and matchedUserId to usernames (if needed)
        setBets(response.data);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error('Failed to fetch bet history:', error);
      setBets([]);
    }
  };

  React.useEffect(() => {
    if (isReload && room.latestSessionID) {
      fetchBets(room.latestSessionID);
      setIsReload(false);
    }
  }, [isReload, room.latestSessionID]);

  React.useEffect(() => {
    if (room.latestSessionID) {
      fetchBets(room.latestSessionID);
    }
  }, [room.latestSessionID]);

  const { user } = useUser();

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!room.latestSessionID) {
      return;
    }

    try {
      if (!formData.selectedTeam) {
        toast.warning('Vui lòng chọn đội');
        return;
      }

      const optionForm = {
        betSessionID: room.latestSessionID,
        makerID: user._id,
        selectedTeam: formData.selectedTeam,
        win: formData.win,
        lost: formData.lost,
      };

      const response = await createBetOption(optionForm);
      if (response.status === 201 || response.status === 200) {
        setIsReload(true); // Trigger table refresh
        toast.success('Tạo thành công');

        if (socket) {
          socket.emit('update-option', {
            roomID: room._id,
          });
        }
      } else {
        console.error('Failed to save bet:', response.statusText);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card sx={{ bgcolor: '#e0e0e0', borderRadius: 4, boxShadow: 3, mb: 8, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Danh sách cược trong phiên{' '}
          <Typography component="span" fontWeight="bold">
            #{room?.latestSessionID}
          </Typography>
        </Typography>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bets?.map((row) => (
              <TableRow hover key={row.code}>
                <TableCell>
                  <Typography variant="subtitle2">{row.code}</Typography>
                </TableCell>
                <TableCell>{`${row.win}:${row.lost}`}</TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    color={row.selectedTeam === TeamEnum.RED ? 'error.main' : 'primary.main'}
                  >
                    {row.selectedTeam === TeamEnum.RED ? 'Gà đỏ' : 'Gà xanh'}
                  </Typography>
                </TableCell>
                <TableCell>{convertDateTime(row.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Modal for creating a new bet */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>Tạo cược</DialogTitle>
          <DialogContent>
            <input type="hidden" name="sessionGameId" value={room?.latestSessionID} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="subtitle2" mb={1}>
                    Đặt
                  </Typography>
                  <Select name="win" value={formData.win} onChange={handleFormChange}>
                    {oddsOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="subtitle2" mb={1}>
                    Ăn
                  </Typography>
                  <Select name="lost" value={formData.lost} onChange={handleFormChange}>
                    {oddsOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup row name="selectedTeam" value={formData.selectedTeam} onChange={handleFormChange}>
                    <FormControlLabel
                      value="RED"
                      control={<Radio />}
                      label={
                        <Typography color="error.main" fontWeight="bold">
                          {room?.redName}
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="BLUE"
                      control={<Radio />}
                      label={
                        <Typography color="primary.main" fontWeight="bold">
                          {room?.blueName}
                        </Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Close
            </Button>
            <Button type="submit" color="primary">
              Tạo
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}

export default BetOptionOtherComponent;
