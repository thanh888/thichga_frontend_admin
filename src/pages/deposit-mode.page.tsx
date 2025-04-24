'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

export default function DepositModePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id || ''; // Lấy id từ URL, đảm bảo không bị null

  const navigate = useRouter();
  return (
    <Box sx={{ width: '100%', py: 2, px: 4, borderRadius: 2, boxShadow: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Cài đặt Chế độ nạp tiền
      </Typography>
      <Grid container spacing={3} marginTop={1}>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel shrink sx={{ fontSize: 20 }}>
              Chọn chế độ
            </InputLabel>
            <Select label="Chọn chế độ" name="deposit_mode">
              <MenuItem value="AUTO">Tự động</MenuItem>
              <MenuItem value="NORMAL">Thủ công</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', mt: 4, display: 'flex', gap: 2, textAlign: 'right', justifyContent: 'center' }}>
        <Button variant="contained">Cập nhật</Button>
      </Box>
    </Box>
  );
}
