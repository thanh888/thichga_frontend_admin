'use client';

import React from 'react';
import { StatusGame } from '@/utils/enum/status-game.enum';
import { TypeGameEnum } from '@/utils/enum/type-game.enum';
import { GameInterface } from '@/utils/interfaces/game.interface';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import DeleteGameDialog from './DeleteGameDialog';
import EditGameDialog from './EditGameDialog';

interface GameCardProps {
  game: GameInterface;
  setIsReload: React.Dispatch<React.SetStateAction<number>>;
}

export const GameCard: React.FC<GameCardProps> = ({ game, setIsReload }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 3,
          position: 'relative',
          borderRadius: { xs: 1, sm: 2 },
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s',
          '&:hover .game-actions': {
            opacity: 1,
          },
        }}
      >
        <Stack
          direction="column"
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="center"
          alignItems="center"
          sx={{
            flexGrow: 1,
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            px: 2,
            pt: 2,
            pb: 4,
          }}
        >
          <img
            alt={game.name}
            src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${game.image}`}
            width={isMobile ? 150 : 200}
            height={isMobile ? 150 : 200}
            style={{ objectFit: 'contain' }}
          />
          <Typography variant="h6" color="primary" fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {game?.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color:
                game.status === StatusGame.ACTIVE
                  ? 'success.main'
                  : game.status === StatusGame.COMING_SOON
                    ? 'warning.main'
                    : 'text.disabled',
              fontWeight: 600,
            }}
          >
            {game.status === StatusGame.ACTIVE
              ? 'Hoạt động'
              : game.status === StatusGame.COMING_SOON
                ? 'Sắp ra mắt'
                : 'Không hoạt động'}
          </Typography>
          {game?.description && (
            <Typography variant="body2" color="textSecondary">
              {game?.description}
            </Typography>
          )}
        </Stack>

        <Box
          className="game-actions"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.3s',
            zIndex: 2,
          }}
        >
          <IconButton onClick={() => setEditOpen(true)} size="small" color="primary">
            <EditIcon />
          </IconButton>
          {![TypeGameEnum.GA_CUA, TypeGameEnum.GA_DON].includes(game.typeGame as TypeGameEnum) && (
            <IconButton onClick={() => setDeleteOpen(true)} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <EditGameDialog open={editOpen} onClose={() => setEditOpen(false)} game={game} setIsReload={setIsReload} />
      <DeleteGameDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        gameId={game._id}
        gameName={game.name}
        setIsReload={setIsReload}
      />
    </>
  );
};
