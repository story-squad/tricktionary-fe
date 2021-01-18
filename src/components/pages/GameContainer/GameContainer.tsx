import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Lobby } from './Game';
import Pregame from './Game/Pregame';

const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [lobbyCode, setLobbyCode] = useState('');
  const [lobbyData, setLobbyData] = useState({ phase: 'LOBBY' });

  useEffect(() => {
    socket.on('game update', (socketData: any) => {
      setLobbyData(socketData);
      console.log(socketData);
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

  const handleJoinLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(lobbyCode);
    socket.emit('join lobby', username, lobbyCode);
  };

  const currentPhase = () => {
    switch (lobbyData.phase) {
      case 'PREGAME':
        return <Pregame lobbyData={lobbyData} />;
      default:
        return (
          <Lobby
            username={username}
            lobbyCode={lobbyCode}
            handleChangeUsername={handleChangeUsername}
            handleChangeCode={handleChangeCode}
            handleCreateLobby={handleCreateLobby}
            handleJoinLobby={handleJoinLobby}
          />
        );
    }
  };

  return <div className="game-container">{currentPhase()}</div>;
};

export default GameContainer;
