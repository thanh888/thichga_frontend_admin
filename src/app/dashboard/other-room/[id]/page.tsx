import DetailOtherRoomPage from '@/pages/detail-other-room.page';

type Props = {
  params: Promise<{ id: string }>;
};

// Add this function to generate static paths
export async function generateStaticParams() {
  // Replace this array with your actual game IDs
  const gameIds = ['1', '2', '3']; // Example IDs

  return gameIds.map((id) => ({
    id: id,
  }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DetailOtherRoomPage roomId={id} />;
}
