// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // đổi theo URL backend NestJS

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const accessToken = localStorage.getItem('account');

  useEffect(() => {
    if (!accessToken) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      extraHeaders: {
        Authorization: accessToken, // JWT từ localStorage hoặc cookie
      },
      auth: {
        token: accessToken,
      },
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    socket.on('error', (err: any) => {
      console.error('Socket error:', err);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  return socketRef.current;
};
