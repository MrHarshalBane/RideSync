import React, { createContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = getSocket();
    socketInstance.connect();

    socketInstance.on('connect', () => {
      console.log('⚡ Connected to Socket.IO Server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('⚡ Disconnected from Socket.IO Server');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
