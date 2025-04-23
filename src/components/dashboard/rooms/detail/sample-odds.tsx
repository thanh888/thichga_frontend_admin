'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Button, ButtonBase, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

export default function SampleOdds() {
  const params = useParams<{ id: string }>();
  const id = params?.id || ''; // Lấy id từ URL, đảm bảo không bị null

  const navigate = useRouter();
  return (
    <>
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
              <Select label="Loại đường dẫn" name="vidCategory">
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="M3U8">M3U8</MenuItem>
                <MenuItem value="IFRAME">IFRAME</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel shrink sx={{ fontSize: 20 }}>
                Tỉ lệ gà xanh:
              </InputLabel>
              <Select label="Loại đường dẫn" name="vidCategory">
                <MenuItem value="">Chọn loại</MenuItem>
                <MenuItem value="M3U8">M3U8</MenuItem>
                <MenuItem value="IFRAME">IFRAME</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
          <Button variant="contained">Cập nhật</Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          py: 2,
          px: 4,
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
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
          99999
        </Typography>
      </Box>
    </>
  );
}
