import WithdrawHistoryPage from '@/pages/withdraws.page';
import { getWithdrawApi } from '@/services/dashboard/withdraw-history.api';

export async function generateStaticParams() {
  let response: any;
  try {
    response = await getWithdrawApi();
  } catch (e) {
    return [];
  }

  if (response && (response.status === 200 || response.status === 201) && Array.isArray(response.data)) {
    return response.data.map((withdraw: { _id: string }) => ({
      id: withdraw._id,
    }));
  }
  // Nếu không có dữ liệu hợp lệ, trả về mảng rỗng
  return [];
}

export default function CustomerDetail() {
  return <WithdrawHistoryPage />;
}
