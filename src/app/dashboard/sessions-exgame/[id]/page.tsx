import SessionExGamePage from '@/pages/session-exgame-page';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page() {
  return <SessionExGamePage />;
}
