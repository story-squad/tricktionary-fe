import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { Lobby, PlayerList, Pregame, Writing, Guessing } from './Game';

const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [lobbyCode, setLobbyCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [lobbyData, setLobbyData] = useState({ phase: 'LOBBY', players: [] });

  // Socket event listeners/handlers. Put them here for now, but extract into separate files later
  useEffect(() => {
    socket.on('game update', (socketData: any) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
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

  const handleSubmitDefinition = (
    e: React.FormEvent<HTMLFormElement>,
    definition: string,
  ) => {
    e.preventDefault();
    socket.emit('definition submitted', definition, lobbyCode);
  };

  const handleSubmitGuess = (
    e: React.FormEvent<HTMLFormElement>,
    guess: string,
  ) => {
    e.preventDefault();
    socket.emit('guess', lobbyCode, guess);
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
      case 'WRITING':
        return (
          <Writing
            lobbyData={lobbyData}
            handleSubmitDefinition={handleSubmitDefinition}
          />
        );
      case 'GUESSING':
        return (
          <Guessing
            lobbyData={lobbyData}
            username={username}
            handleSubmitGuess={handleSubmitGuess}
          />
        );
      case 'POSTGAME':
        //TODO do this
        return null;
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
        <>
          <p>Room Code: {lobbyCode}</p>
          <PlayerList players={lobbyData.players} />
        </>
      )}
      {currentPhase()}
    </div>
  );
};

export default GameContainer;
