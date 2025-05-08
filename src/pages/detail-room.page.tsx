'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { getOneBetroomId } from '@/services/dashboard/bet-room.api';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';

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

  const [isReload, setIsReload] = useState<boolean>(true);

  const [room, setRoom] = React.useState<BettingRoomInterface>();

  const fetchRoomData = async (roomId: string) => {
    try {
      const response = await getOneBetroomId(roomId);
      if (response.status === 200) {
        setRoom(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (id && isReload) {
      fetchRoomData(id);
      setIsReload(false);
    }
  }, [id, isReload]);

  return (
    <>
      {room && <EditRoom data={room} setIsReload={setIsReload} />}
      <SampleOdds data={room} />
      <BetOptionComponent />
      {room?.latestSessionID && (
        <BetHistoryComponent sessionID={room.latestSessionID} room={room} isReload={isReload} />
      )}
      {room?.latestSessionID && <BetSesionComponent isReload={isReload} setIsReload={setIsReload} />}
    </>
  );
}
