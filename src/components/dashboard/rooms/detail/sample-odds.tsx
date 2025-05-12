'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UpdateOdds } from '@/services/dashboard/bet-room.api';
import { TypeBetRoomEnum } from '@/utils/enum/type-bet-room.enum';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

interface OddsFormData {
  redOdds: string;
  blueOdds: string;
}
export default function SampleOdds({ data }: { data: BettingRoomInterface }) {
  const params = useParams<{ id: string }>();
  const id = params?.id || ''; // Lấy id từ URL, đảm bảo không bị null

  const [formData, setFormData] = useState<OddsFormData>();

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (event.target.name) {
      setFormData((prev: any) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };
  const handleUpdateOdds = async () => {
    try {
      const response = await UpdateOdds(id, formData);
      if (response.status === 201) {
        toast.success('Cập nhật tỷ lệ thành công');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFormData({
      redOdds: data?.redOdds?.toString() || '10',
      blueOdds: data?.blueOdds?.toString() || '10',
    });
  }, [data]);

  const [seconds, setSeconds] = useState();

  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    if (!data?.isAcceptBetting) return;

    const now = Date.now();
    const endTime = new Date(data.endingAt || 0).getTime();
    const initialSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
    setSecondsLeft(initialSeconds);

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data?.endingAt, data?.isAcceptBetting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      {data?.typeRoom === TypeBetRoomEnum.SOLO && (
        <Box sx={{ width: '100%', py: 2, px: 4, borderRadius: 2, boxShadow: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tỉ lệ hiển thị mẫu
          </Typography>
          <Grid container spacing={3} marginTop={1}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontSize: 20 }}>
                  Tỉ lệ gà đỏ:
                </InputLabel>
                <Select
                  label=" Tỉ lệ gà đỏ:"
                  value={Number(formData?.redOdds)}
                  name="redOdds"
                  sx={{ fontSize: 20 }}
                  onChange={handleChange}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <MenuItem key={i} value={(i + 1) * 0.5} sx={{ fontSize: 20 }}>
                      {(i + 1) * 0.5}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel shrink sx={{ fontSize: 20 }}>
                  Tỉ lệ gà xanh:
                </InputLabel>
                <Select
                  label="Tỉ lệ gà xanh:"
                  name="blueOdds"
                  value={Number(formData?.blueOdds)}
                  onChange={handleChange}
                  sx={{ fontSize: 20 }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <MenuItem key={i} value={(i + 1) * 0.5} sx={{ fontSize: 20 }}>
                      {(i + 1) * 0.5}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleUpdateOdds}>
              Cập nhật
            </Button>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          py: 2,
          px: 4,
          borderRadius: 2,
          boxShadow: 3,
          my: 4,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Thời gian còn lại:
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ border: '1px solid red', borderRadius: 1, padding: '2px', color: 'red', marginLeft: 1 }}
        >
          {formatTime(secondsLeft)}
        </Typography>
      </Box>
    </>
  );
}
