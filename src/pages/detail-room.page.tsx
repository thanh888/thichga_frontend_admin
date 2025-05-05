'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { getOneBetroomId } from '@/services/dashboard/bet-room.api';

import BetHistoryComponent from '@/components/dashboard/rooms/detail/bet-history';
import BetOptionComponent from '@/components/dashboard/rooms/detail/bet-option';
import BetSesionComponent from '@/components/dashboard/rooms/detail/bet-session';
import SampleOdds from '@/components/dashboard/rooms/detail/sample-odds';
import EditRoom from '@/components/dashboard/rooms/detail/update-room';

interface RoomeFormData {
  roomName: string;
  thumbnail: string;
  urlLive: string;
  urlType: string;
  secondsEnding: string;
  fee: string;
  marquee: string;
  chattingJframe: string;
  redName: string;
  blueName: string;
  leftText: string;
  centerText: string;
  rightText: string;
  isOpened?: boolean;
  isAcceptBetting?: boolean;
  redOdds?: number;
  blueOdds?: number;
  typeRoom?: string;
}
export default function DetailRoom() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';

  const [formData, setFormData] = React.useState<RoomeFormData | null>(null);

  const fetchRoomData = async (roomId: string): Promise<RoomeFormData> => {
    try {
      const response = await getOneBetroomId(roomId);
      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Failed to fetch room data');
    } catch (error) {
      console.log(error);
      throw new Error('Error fetching room data');
    }
  };

  React.useEffect(() => {
    if (id) {
      fetchRoomData(id).then((data) => {
        setFormData({
          roomName: data.roomName ?? '',
          thumbnail: data.thumbnail ?? '',
          urlLive: data.urlLive ?? '',
          urlType: data.urlType ?? '',
          secondsEnding: data.secondsEnding ?? '',
          fee: data.fee ?? '',
          marquee: data.marquee ?? '',
          chattingJframe: data.chattingJframe ?? '',
          redName: data.redName ?? '',
          blueName: data.blueName ?? '',
          leftText: data.leftText ?? '',
          centerText: data.centerText ?? '',
          rightText: data.rightText ?? '',
          isOpened: data.isOpened ?? false,
          isAcceptBetting: data.isAcceptBetting ?? false,
          redOdds: data.redOdds ?? 10,
          blueOdds: data.blueOdds ?? 10,
          typeRoom: data.typeRoom ?? '',
        });
      });
    }
  }, [id]);

  return (
    <>
      <EditRoom data={formData} />
      <SampleOdds data={formData} />
      <BetOptionComponent />
      <BetHistoryComponent />
      <BetSesionComponent />
    </>
  );
}
