import SessionDetailPage from '@/pages/bet-session-page';
import { findAllBetSessionApi } from '@/services/dashboard/bet-session.api';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <SessionDetailPage sessionId={id} />;
}
