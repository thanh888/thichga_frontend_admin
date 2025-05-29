import RevenueDetailpage from '@/pages/revenue-detail-page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page() {
  return <RevenueDetailpage />;
}
