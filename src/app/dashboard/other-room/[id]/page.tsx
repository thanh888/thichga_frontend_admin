import DetailRoom from '@/pages/detail-room.page';

type Props = {
  params: Promise<{ id: string }>;
};

// Define the possible values for the `id` parameter
export async function generateStaticParams() {
  // Replace this with your actual logic to fetch possible room IDs
  const roomIds = ['1', '2', '3']; // Example: List of room IDs

  // Return an array of objects with the `id` param
  return roomIds.map((id) => ({
    id,
  }));
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DetailRoom roomId={id} />;
}
