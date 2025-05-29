'use client';

import * as React from 'react';
import { findAllBetHistoryApi } from '@/services/dashboard/bet-history.api';
import { findAllRevenueApi } from '@/services/dashboard/revenue.api';
import { BettingHistoryInterface } from '@/utils/interfaces/bet-history.interface';
import { BettingRevenueInterface } from '@/utils/interfaces/revenue.interface';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { Budget } from '@/components/dashboard/overview/budget';
import { RevenueTable } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { TotalLineChart } from '@/components/dashboard/overview/line-revenue';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalColumnChart } from '@/components/dashboard/overview/total-column-chart';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Filter } from '@/components/dashboard/overview/traffic';

export default function HomePage(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="324" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      {/* <Grid lg={4} md={6} xs={12}> */}
      {/* <Filter betHistories={betHistories}} sx={{ height: '100%' }} /> */}
      {/* </Grid> */}
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
