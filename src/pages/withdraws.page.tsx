import WithdrawHistoryTable from '@/components/dashboard/withdraws/withdraw-history-table';
import WithdrawStatusTable from '@/components/dashboard/withdraws/withdraw-status-table';

export default function WithdrawHistoryPage() {
  return (
    <>
      <WithdrawStatusTable />
      <WithdrawHistoryTable />
    </>
  );
}
