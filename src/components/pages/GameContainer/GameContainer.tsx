import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Lobby } from './Game';

const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const [gameState, setGameState] = useState('lobby');
  const [username, setUsername] = useState('user');
  const [lobbyCode, setLobbyCode] = useState('');

  useEffect(() => {
    socket.on('game update', (lobbyData: any) => {
      console.log(lobbyData);
    });
  }, []);

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyCode(e.target.value);
  };

  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username);
  };

  const currentPhase = () => {
    switch (gameState) {
      case 'lobby':
        return (
          <Lobby
            username={username}
            lobbyCode={lobbyCode}
            handleChangeUsername={handleChangeUsername}
            handleChangeCode={handleChangeCode}
            handleCreateLobby={handleCreateLobby}
          />
        );
    }
  };

  return <div className="game-container">{currentPhase()}</div>;
};

export default GameContainer;
