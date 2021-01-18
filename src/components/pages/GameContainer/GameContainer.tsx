import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Lobby, PlayerList, Pregame } from './Game';

const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [lobbyCode, setLobbyCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [lobbyData, setLobbyData] = useState({ phase: 'LOBBY', players: [] });

  // If lobbyCode changes, isHost set to false
  useEffect(() => {
    setIsHost(false);
  }, [lobbyCode]);

  // Socket event listeners/handlers. Put them here for now, but extract into separate files later
  useEffect(() => {
    socket.on('game update', (socketData: any) => {
      setLobbyData(socketData);
      console.log(socketData);
    });
  }, []);

  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username);
    setIsHost(true);
  };

  const handleJoinLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(lobbyCode);
    socket.emit('join lobby', username, lobbyCode);
  };

  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('start game', lobbyCode);
  };
  ////

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyCode(e.target.value);
  };

  const currentPhase = () => {
    switch (lobbyData.phase) {
      case 'PREGAME':
        return (
          <Pregame
            lobbyData={lobbyData}
            handleStartGame={handleStartGame}
            isHost={isHost}
          />
        );
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

  return (
    <div className="game-container">
      {lobbyData.phase !== 'LOBBY' && (
        <PlayerList players={lobbyData.players} />
      )}
      {currentPhase()}
    </div>
  );
};

export default GameContainer;
