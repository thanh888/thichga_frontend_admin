import DetailRoom from '@/pages/detail-room.page';
import { getAllBetRoom } from '@/services/dashboard/bet-room.api';

export async function generateStaticParams() {
  let response: any;
  try {
    response = await getAllBetRoom();
  } catch (e) {
    return [];
  }

  if (response && (response.status === 200 || response.status === 201) && Array.isArray(response.data)) {
    return response.data.map((room: { _id: string }) => ({
      id: room._id,
    }));
  }
  // Nếu không có dữ liệu hợp lệ, trả về mảng rỗng
  return [];
}

export default function Page() {
  return <DetailRoom />;
}
