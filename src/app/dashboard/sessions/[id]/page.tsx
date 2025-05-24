import SessionDetailPage from '@/pages/bet-session-page';
import { findAllBetSessionApi } from '@/services/dashboard/bet-session.api';

export async function generateStaticParams() {
  let response: any;
  try {
    response = await findAllBetSessionApi();
  } catch (e) {
    return [];
  }

  if (response && (response.status === 200 || response.status === 201) && Array.isArray(response.data)) {
    return response.data.map((session: { _id: string }) => ({
      id: session._id,
    }));
  }
  // Nếu không có dữ liệu hợp lệ, trả về mảng rỗng
  return [];
}

export default function BetSession() {
  return <SessionDetailPage />;
}
