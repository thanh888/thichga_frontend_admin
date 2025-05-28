import HistoryOptionExGamePage from '@/pages/history-exgame-page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page() {
  return <HistoryOptionExGamePage />;
}
