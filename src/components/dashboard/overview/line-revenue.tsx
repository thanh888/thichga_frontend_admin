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
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export interface Props {
  sx?: SxProps;
}

function getDefaultDates() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const format = (date: Date) => date.toISOString().split('T')[0];
  return {
    startDate: format(start),
    endDate: format(end),
  };
}

export function TotalLineChart({ sx }: Props): React.JSX.Element {
  const theme = useTheme();
  const { startDate: defaultStartDate, endDate: defaultEndDate } = getDefaultDates();
  const [revenues, setRevenues] = React.useState<any[]>([]);
  const [period, setPeriod] = React.useState<string>('month');
  const [startDate, setStartDate] = React.useState<string>(defaultStartDate);
  const [endDate, setEndDate] = React.useState<string>(defaultEndDate);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getRevenues = async () => {
    setLoading(true);
    try {
      const query = `period=${period}&startDate=${startDate.replace(/-/g, '/')}&endDate=${endDate.replace(/-/g, '/')}`;
      const response = await findTotalLineRevenueApi(query);
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
        <div style={{ marginBottom: 16 }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Lọc kiểu</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
              <MenuItem value="week">Tuần</MenuItem>
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
    const [year, month, day] = item._id.split('/');
    if (period === 'year') {
      return `Tháng ${parseInt(month)}/${year}`;
    }
    return day ? `Ngày ${parseInt(day)}/${parseInt(month)}/${year}` : `Tháng ${parseInt(month)}/${year}`;
  });

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    colors: ['#1976D2', '#64B5F6', '#4CAF50', '#D32F2F', '#26A69A', '#AB47BC'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
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
      size: 5,
      hover: { size: 8 },
    },
    xaxis: {
      categories,
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      labels: {
        style: { colors: theme.palette.text.secondary },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}K`,
        style: { colors: theme.palette.text.secondary },
      },
    },
    tooltip: {
      enabled: true,
      y: { formatter: (value) => `${value}K` },
    },
    series: [
      { name: 'Tổng Hoa Hồng', data: revenues.map((r) => r.totalProfit || 0) },
      { name: 'Tổng Doanh Thu', data: revenues.map((r) => r.totalRevenue || 0) },
      { name: 'Tổng Tiền Cược', data: revenues.map((r) => r.totalBetMoney || 0) },
      { name: 'Tổng Chi Phí', data: revenues.map((r) => r.totalExpense || 0) },
      { name: 'Tổng Nạp', data: revenues.map((r) => r.totalDeposits || 0) },
      { name: 'Tổng Rút', data: revenues.map((r) => r.totalWithdraw || 0) },
    ],
  };

  return chartOptions;
}
