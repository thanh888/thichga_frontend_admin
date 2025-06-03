'use client';

import * as React from 'react';
import { Box } from '@mui/material';

import CreateGameComponent from '@/components/dashboard/game/create-game';
import GameList from '@/components/dashboard/game/GameList';

export default function GamePages() {
  const [isReload, setIsReload] = React.useState<number>(0);

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 4 },
        maxWidth: '1200px',
        margin: '0 auto',
        mt: 4,
      }}
    >
      <CreateGameComponent setIsReload={setIsReload} />
      <GameList isReload={isReload} setIsReload={setIsReload} />
    </Box>
  );
}
