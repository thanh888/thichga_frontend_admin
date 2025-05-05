'use client';

import React from 'react';

import DepositHistoryTable from '@/components/dashboard/deposites/deposit-history-table';
import DepositStatusTable from '@/components/dashboard/deposites/deposit-status-table';

export default function DepositHistoryPage() {
  const [isReload, setIsReload] = React.useState<boolean>(true);

  return (
    <>
      <DepositStatusTable isReload={isReload} setIsReload={setIsReload} />
      <DepositHistoryTable isReload={isReload} setIsReload={setIsReload} />
    </>
  );
}
