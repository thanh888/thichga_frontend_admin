'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { findTotalColumnRevenueApi } from '@/services/dashboard/revenue.api';
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

export function TotalColumnChart({ sx }: Props): React.JSX.Element {
  const theme = useTheme();
  const [revenues, setRevenues] = React.useState<any[]>([]);
  const [period, setPeriod] = React.useState<string>('month');
  const [selectedDate, setSelectedDate] = React.useState<string>('2025-05-01');
  const [loading, setLoading] = React.useState<boolean>(false);

  const getRevenues = async () => {
    setLoading(true);
    try {
      let query = `period=${period}`;
      if (period === 'day') {
        query += `&date=${selectedDate.replace(/-/g, '/')}`;
      } else if (period === 'month') {
        const [year, month] = selectedDate.split('-');
        query += `&startDate=${year}/${month}/01&endDate=${year}/${month}/31`;
      } else if (period === 'year') {
        const year = selectedDate.split('-')[0];
        query += `&startDate=${year}/01/01&endDate=${year}/12/31`;
      }
      const response = await findTotalColumnRevenueApi(query);
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
  }, [period, selectedDate]);

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
        title={`Biểu đồ tổng doanh thu (${period === 'month' ? 'Tháng' : period === 'day' ? 'Ngày' : 'Năm'})`}
      />
      <CardContent>
        <div style={{ marginBottom: '16px' }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel>Period</InputLabel>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} label="Period">
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={period === 'day' ? 'Select Date' : period === 'month' ? 'Select Month' : 'Select Year'}
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              type: period === 'month' ? 'month' : period === 'year' ? 'number' : 'date',
              min: period === 'year' ? '2000' : undefined,
              max: period === 'year' ? '2100' : undefined,
            }}
            sx={{ width: 200 }}
          />
        </div>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : revenues.length === 0 ? (
          <p>Không có dữ liệu để hiển thị</p>
        ) : (
          <ApexChart height={350} options={chartOptions} series={chartOptions.series} type="bar" width="100%" />
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
    const [year, periodValue] = item._id.split('/');
    if (period === 'month') return `Tháng ${parseInt(periodValue)}/${year}`;
    if (period === 'day') return `Ngày ${item._id}`;
    return `Năm ${year}`;
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
      stacked: false,
      toolbar: { show: false },
    },
    colors: [
      theme.palette.primary.main, // Total Profit
      alpha(theme.palette.primary.main, 0.5), // Total Revenue
      theme.palette.success.main, // Total Bet Money
      theme.palette.error.main, // Total Expense
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
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
    plotOptions: {
      bar: { columnWidth: '50%' }, // Hẹp cột để phù hợp với một khoảng thời gian
    },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories,
      labels: {
        style: { colors: theme.palette.text.secondary },
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
        formatter: (value) => `${value}K`,
      },
    },
    series: [
      { name: 'Tổng Hoa Hồng', data: totalProfit },
      { name: 'Tổng Doanh Thu', data: totalRevenue },
      { name: 'Tổng Tiền Cược', data: totalBetMoney },
      { name: 'Tổng Chi Phí', data: totalExpense },
      { name: 'Tổng Nạp', data: totalDeposits },
      { name: 'Tổng rút', data: totalWithdraw },
    ],
  };

  console.log('Chart Options:', chartOptions); // Debug
  return chartOptions;
}
