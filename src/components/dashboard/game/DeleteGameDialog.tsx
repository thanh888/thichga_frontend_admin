'use client';

import React from 'react';
import { deleteGameById } from '@/services/dashboard/game.api';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';

interface DeleteGameDialogProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
  gameName: string;
  setIsReload: React.Dispatch<React.SetStateAction<number>>;
}

export default function DeleteGameDialog({ open, onClose, gameId, gameName, setIsReload }: DeleteGameDialogProps) {
  const handleDelete = async () => {
    try {
      const response = await deleteGameById(gameId);
      if (response.status === 200 || response.status === 204) {
        toast.success(`Xóa trò chơi "${gameName}" thành công`);
        setIsReload((prev) => prev + 1);
        onClose();
      } else {
        console.error('Failed to delete game:', response);
        toast.error('Xóa trò chơi thất bại');
      }
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa trò chơi <strong>{gameName}</strong>? Hành động này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
