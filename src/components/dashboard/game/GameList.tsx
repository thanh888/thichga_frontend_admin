import { useEffect, useState } from 'react';
import { findAllGameApi } from '@/services/dashboard/game.api';
import { GameInterface } from '@/utils/interfaces/game.interface';
import { Box, Grid } from '@mui/material';

import { GameCard } from './GameCard';

interface Game {
  _id: string;
  name: string;
  image: string;
  description?: string;
  status: string;
}

interface Props {
  setIsReload: React.Dispatch<React.SetStateAction<number>>;
  isReload: number;
}

export default function GameList({ setIsReload, isReload }: Readonly<Props>) {
  const [games, setGames] = useState<GameInterface[]>([]);

  const getAllGames = async () => {
    try {
      const response = await findAllGameApi('');
      if (response.status === 200 || response.status === 201) {
        setGames(response.data);
      } else {
        console.error('Failed to create game:', response);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    getAllGames();
  }, [isReload]);

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={2}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} md={4} key={game._id}>
            <GameCard game={game} setIsReload={setIsReload} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
