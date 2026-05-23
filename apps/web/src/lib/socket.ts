import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true
});

socket.on('connect', () => {
  console.log('Connected to BOBA AGENT WS');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WS');
});
