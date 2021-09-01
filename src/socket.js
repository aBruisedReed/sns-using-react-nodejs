import { createContext } from 'react';
import socketio from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();

export const socket = socketio.connect(process.env.REACT_APP_SERVER_URL);
export const SocketContext = createContext(null);

