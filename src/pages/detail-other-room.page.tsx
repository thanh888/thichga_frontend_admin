'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { getOneBetroomId } from '@/services/dashboard/bet-room.api';
import { BettingRoomInterface } from '@/utils/interfaces/bet-room.interface';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

import BetOptionOtherComponent from '@/components/dashboard/other-room/detail-other-room/bet-other-option';
import BetSesionOtherComponent from '@/components/dashboard/other-room/detail-other-room/bet-other-session';
import UpdateOtherRoom from '@/components/dashboard/other-room/detail-other-room/update-other-room';

interface Props {
  roomId: string;
}
export default function DetailOtherRoomPage({ roomId }: Props) {
  const params = useParams<{ id: string }>();
  const id = params?.id.toString();

  const [isReload, setIsReload] = useState<boolean>(true);

  const [room, setRoom] = React.useState<BettingRoomInterface>({});

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
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          {room && <UpdateOtherRoom data={room} setIsReload={setIsReload} />}
        </Grid>
        <Grid item xs={12} md={7}>
          {room?.latestSessionID && <BetOptionOtherComponent room={room} />}

          {room?.latestSessionID && <BetSesionOtherComponent isReload={isReload} setIsReload={setIsReload} />}
        </Grid>
      </Grid>
    </Box>
  );
}
