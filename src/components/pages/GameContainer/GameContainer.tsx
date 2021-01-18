import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Lobby } from './GameComponents';

const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const [gameState, setGameState] = useState('lobby');
  const [username, setUsername] = useState('user');
  const [lobbyCode, setLobbyCode] = useState('');

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangeLobby = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyCode(e.target.value);
  };

  const currentPhase = () => {
    switch (gameState) {
      case 'lobby':
        return <Lobby />;
    }
  };

  return <div className="game-container">{currentPhase()}</div>;
};

export default GameContainer;
