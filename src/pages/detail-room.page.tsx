import BetHistoryComponent from '@/components/dashboard/rooms/detail/bet-history';
import BetSesionComponent from '@/components/dashboard/rooms/detail/bet-session';
import SampleOdds from '@/components/dashboard/rooms/detail/sample-odds';
import EditRoom from '@/components/dashboard/rooms/detail/update-room';

export default function DetailRoom() {
  return (
    <>
      <EditRoom />
      <SampleOdds />
      <BetHistoryComponent />
      <BetSesionComponent />
    </>
  );
}
