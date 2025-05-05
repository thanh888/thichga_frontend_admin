'use client';

import React from 'react';

import WithdrawHistoryTable from '@/components/dashboard/withdraws/withdraw-history-table';
import WithdrawStatusTable from '@/components/dashboard/withdraws/withdraw-status-table';

export default function WithdrawHistoryPage() {
  const [isReload, setIsReload] = React.useState<boolean>(true);
  return (
    <>
      <WithdrawStatusTable isReload={isReload} setIsReload={setIsReload} />
      <WithdrawHistoryTable isReload={isReload} setIsReload={setIsReload} />
    </>
  );
}
