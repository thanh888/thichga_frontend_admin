import DetailRoom from '@/pages/detail-room.page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DetailRoom roomId={id} />;
}
