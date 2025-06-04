'use client';

import * as React from 'react';
import { getCountStatsApi } from '@/services/dashboard/stats.api';
import Grid from '@mui/material/Unstable_Grid2';

import { TotalLineChart } from '@/components/dashboard/overview/line-revenue';
import { RevenueTable } from '@/components/dashboard/overview/revenue-table';
import { TotalDeposits } from '@/components/dashboard/overview/tasks-deposits';
import { TotalColumnChart } from '@/components/dashboard/overview/total-column-chart';
import { TotalRooms } from '@/components/dashboard/overview/total-rooms';
import { UserActive } from '@/components/dashboard/overview/total-users';
import { TotalWithdraw } from '@/components/dashboard/overview/total-withdraw';

interface CountStatsInterface {
  countUser: number;
  countRoom: number;
  countDeposit: number;
  countWithdraw: number;
}
export default function HomePage(): React.JSX.Element {
  const [countStats, setCountStats] = React.useState<CountStatsInterface>({
    countDeposit: 0,
    countRoom: 0,
    countUser: 0,
    countWithdraw: 0,
  });

  const getCountStats = async () => {
    try {
      const response = await getCountStatsApi();
      if (response.status === 200 || response.status === 201) {
        setCountStats(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getCountStats();
  }, []);
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <UserActive sx={{ height: '100%' }} value={countStats?.countUser?.toString()} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalRooms sx={{ height: '100%' }} value={countStats?.countRoom?.toString()} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalDeposits sx={{ height: '100%' }} value={countStats?.countDeposit} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalWithdraw sx={{ height: '100%' }} value={countStats?.countWithdraw?.toString()} />
      </Grid>
      <Grid lg={6} xs={12}>
        <TotalColumnChart sx={{ height: '100%' }} />
      </Grid>

      <Grid lg={6} xs={12}>
        <TotalLineChart sx={{ height: '100%' }} />
      </Grid>

      <Grid lg={21} md={12} xs={12}>
        <RevenueTable />
      </Grid>
    </Grid>
  );
}
