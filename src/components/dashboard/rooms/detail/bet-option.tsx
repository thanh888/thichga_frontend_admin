'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { paginateBetHistoryApi } from '@/services/dashboard/bet-history';
import { createBetOption } from '@/services/dashboard/bet-option.api';
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

// Định nghĩa interface cho dữ liệu bảng
interface BetData {
  code: string;
  red_odds: number;
  blue_odds: number;
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
  { id: 'action', label: 'Hành động', minWidth: 120, align: 'center' },
];

interface Props {
  isReload: boolean;
  setIsReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BetOptionComponent(): React.JSX.Element {
  const [isReload, setIsReload] = React.useState<boolean>(true);

  const [bets, setBets] = React.useState<BetData[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    red_odds: '10',
    blue_odds: '10',
    result: 'Gà đỏ',
  });

  const params = useParams<{ id: string }>();
  const sessionGameId = params?.id || '';
  const router = useRouter();

  const oddsOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

  const fetchBets = async () => {
    try {
      const query = `limit=1000&isCurrent=true`; // Fetch all bets, assuming high limit
      const response = await paginateBetHistoryApi(sessionGameId, query);
      if (response.status === 200 || response.status === 201) {
        // Transform creatorID and matchedUserId to usernames (if needed)
        const transformedData = response.data.docs.map((item: any) => ({
          ...item,
          creatorID: item.creatorID?.username || 'N/A',
          matchedUserId: item.matchedUserId?.username || 'N/A',
        }));
        setBets(transformedData);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error('Failed to fetch bet history:', error);
      setBets([]);
    }
  };

  React.useEffect(() => {
    if (isReload) {
      fetchBets();
      setIsReload(false);
    }
  }, [isReload]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ red_odds: '10', blue_odds: '10', result: 'Gà đỏ' }); // Reset form
  };

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const createForm = {
        betSessionID: '',
        makerID: '',
        selectedTeam: '',
        red_odds: '',
        blue_odds: '',
      };
      const response = await createBetOption('', formData);
      if ((response.status === 201, response.status === 200)) {
        setIsReload(true); // Trigger table refresh
        handleCloseModal();
      } else {
        console.error('Failed to save bet:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleViewDetail = (code: string) => {
    router.push(`/bets/${code}`);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Danh sách tạo cược cho phiên{' '}
          <Typography component="span" fontWeight="bold">
            #{sessionGameId}
          </Typography>
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Thêm cược
        </Button>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
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
            {bets.map((row) => (
              <TableRow hover key={row.code}>
                <TableCell>
                  <Typography variant="subtitle2">{row.code}</Typography>
                </TableCell>
                <TableCell>{`${row.red_odds}:${row.blue_odds}`}</TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color={row.selectedTeam === 'Gà đỏ' ? 'error.main' : 'primary.main'}>
                    {row.selectedTeam}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained" color="success" onClick={() => handleViewDetail(row.code)}>
                    Chi tiết
                  </Button>
                </TableCell>
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
            <input type="hidden" name="sessionGameId" value={sessionGameId} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <Typography variant="subtitle2" mb={1}>
                    Đặt
                  </Typography>
                  <Select name="red_odds" value={formData.red_odds} onChange={handleFormChange}>
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
                  <Select name="blue_odds" value={formData.blue_odds} onChange={handleFormChange}>
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
                  <RadioGroup row name="result" value={formData.result} onChange={handleFormChange}>
                    <FormControlLabel
                      value="RED"
                      control={<Radio />}
                      label={
                        <Typography color="error.main" fontWeight="bold">
                          TH NGUYÊN
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="BLUE"
                      control={<Radio />}
                      label={
                        <Typography color="primary.main" fontWeight="bold">
                          FC 0333343
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
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}

export default BetOptionComponent;
