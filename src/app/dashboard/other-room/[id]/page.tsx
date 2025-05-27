import DetailOtherRoomPage from '@/pages/detail-other-room.page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DetailOtherRoomPage roomId={id} />;
}
