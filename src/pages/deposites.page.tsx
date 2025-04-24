import DepositHistoryTable from '@/components/dashboard/deposites/deposit-history-table';
import DepositStatusTable from '@/components/dashboard/deposites/deposit-status-table';

export default function DepositHistoryPage() {
  return (
    <>
      <DepositStatusTable />
      <DepositHistoryTable />
    </>
  );
}
