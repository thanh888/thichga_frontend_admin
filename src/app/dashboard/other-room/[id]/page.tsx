import DetailOtherRoomPage from '@/pages/detail-other-room.page';
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

interface Props {
  params: { id: string };
}
export default function Page({ params }: Props) {
  return <DetailOtherRoomPage roomId={params.id} />;
}
