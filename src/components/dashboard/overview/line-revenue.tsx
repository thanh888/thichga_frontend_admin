'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { findTotalLineRevenueApi } from '@/services/dashboard/revenue.api';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface Props {
  sx?: SxProps;
}

export function TotalLineChart({ sx }: Props): React.JSX.Element {
  const theme = useTheme();
  const [revenues, setRevenues] = React.useState<any[]>([]);
  const [period, setPeriod] = React.useState<string>('month');
  const [startDate, setStartDate] = React.useState<string>('2025-05-01');
  const [endDate, setEndDate] = React.useState<string>('2025-05-31');
  const [loading, setLoading] = React.useState<boolean>(false);

  const getRevenues = async () => {
    setLoading(true);
    try {
      const query = `period=${period}&startDate=${startDate.replace(/-/g, '/')}&endDate=${endDate.replace(/-/g, '/')}`;
      const response = await findTotalLineRevenueApi(query);
      console.log('API Response:', response.data); // Debug
      if (response.status === 200 || response.status === 201) {
        setRevenues(response.data);
      } else {
        setRevenues([]);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
      setRevenues([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getRevenues();
  }, [period, startDate, endDate]);

  const chartOptions = useChartOptions(revenues, period);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={getRevenues}
            disabled={loading}
          >
            Sync
          </Button>
        }
        title={`Biểu đồ doanh thu (${period === 'month' ? 'Tháng' : period === 'week' ? 'Tuần' : 'Năm'})`}
      />
      <CardContent>
        <div style={{ marginBottom: '16px' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Lọc kiểu</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
              <MenuItem value="week">Tuần`</MenuItem>
              <MenuItem value="month">Tháng</MenuItem>
              <MenuItem value="year">Năm</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ marginRight: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : revenues.length === 0 ? (
          <p>Không có dữ liệu để hiển thị</p>
        ) : (
          <ApexChart height={350} options={chartOptions} series={chartOptions.series} type="line" width="100%" />
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(revenues: any[], period: string): ApexOptions {
  const theme = useTheme();

  const categories = revenues.map((item) => {
    const [year, periodValue, day] = item._id.split('/');
    if (period === 'year') {
      return `Tháng ${parseInt(periodValue)}/${year}`;
    }
    return day ? `Ngày ${parseInt(day)}/${parseInt(periodValue)}/${year}` : `Tháng ${parseInt(periodValue)}/${year}`;
  });
  const totalProfit = revenues.map((item) => item.totalProfit || 0);
  const totalRevenue = revenues.map((item) => item.totalRevenue || 0);
  const totalBetMoney = revenues.map((item) => item.totalBetMoney || 0);
  const totalExpense = revenues.map((item) => item.totalExpense || 0);
  const totalDeposits = revenues.map((item) => item.totalDeposits || 0);
  const totalWithdraw = revenues.map((item) => item.totalWithdraw || 0);

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    colors: [
      '#1976D2', // Total Profit - Deep Blue
      '#64B5F6', // Total Revenue - Light Blue
      '#4CAF50', // Total Bet Money - Green
      '#D32F2F', // Total Expense - Red
      '#26A69A', // Total Deposits - Teal
      '#AB47BC', // Total Withdraw - Purple
    ],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth', // Smooth curve for lines
      width: 3,
    },
    fill: { opacity: 1 },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      position: 'top',
      labels: { colors: theme.palette.text.secondary },
    },
    markers: {
      size: 5, // Show points on lines
      hover: { size: 8 },
    },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories,
      labels: {
        style: { colors: theme.palette.text.secondary },
        rotate: -45, // Rotate labels if too long
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value >= 0 ? `${value}K` : `${value}k`),
        style: { colors: theme.palette.text.secondary },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => (value >= 0 ? `${value}K` : `${value}k`),
      },
    },
    series: [
      { name: 'Tổng Hoa Hồng', data: totalProfit },
      { name: 'Tổng Doanh Thu', data: totalRevenue },
      { name: 'Tổng Tiền Cược', data: totalBetMoney },
      { name: 'Tổng Chi Phí', data: totalExpense },
      { name: 'Tổng Nạp', data: totalDeposits },
      { name: 'Tổng Rút', data: totalWithdraw },
    ],
  };

  console.log('Chart Options:', chartOptions); // Debug
  return chartOptions;
}
