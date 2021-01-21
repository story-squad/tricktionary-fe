import React, { SetStateAction, useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  Guessing,
  Lobby,
  PlayerList,
  Postgame,
  Pregame,
  Writing,
} from './Game';
import { LobbyData } from './gameTypes';
import { getReactions } from '../../../api/apiRequests';

const socket = io.connect(process.env.REACT_APP_API_URL as string);
const initialLobbyData: LobbyData = {
  phase: 'LOBBY',
  players: [],
  definition: '',
  host: { id: '', username: '' },
  guesses: [],
  lobbyCode: '',
  roundId: -1,
  word: '',
};

const GameContainer = (): React.ReactElement => {
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [lobbyCode, setLobbyCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [lobbyData, setLobbyData] = useState(initialLobbyData);
  const [submittedGuess, setSubmittedGuess] = useState(false);
  const [playerId, setPlayerId] = useState('');

  // Socket event listeners/handlers.
  useEffect(() => {
    getReactions().then((res) => console.log(res));
    socket.on('game update', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      console.log(socketData);
    });
    socket.on('play again', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      setSubmittedGuess(false);
      console.log(socketData);
    });
    // Get your playerId from the BE
    socket.on('welcome', (socketData: string) => {
      setPlayerId(socketData);
    });
    // Recieve BE errors
    socket.on('error', (errorData: any) => {
      console.log(errorData);
    });
  }, []);

  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username);
    setIsHost(true);
  };

  const handleJoinLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('join lobby', username, lobbyCode);
  };

  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('start game', lobbyCode);
  };

  const handleSubmitDefinition = (
    e: React.FormEvent<HTMLFormElement>,
    definition: string,
    cb: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    e.preventDefault();
    const trimmedDefinition = definition.trim();
    if (trimmedDefinition !== '') {
      socket.emit('definition submitted', trimmedDefinition, lobbyCode);
      cb(true);
    }
  };

  const handleSubmitGuess = (
    e: React.FormEvent<HTMLFormElement>,
    guess: string,
  ) => {
    e.preventDefault();
    socket.emit('guess', lobbyCode, guess, []);
    setSubmittedGuess(true);
  };

  const handlePlayAgain = () => {
    socket.emit('play again', lobbyCode);
  };
  ////

  // determine Game component to render based on the current game phase
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
            submittedGuess={submittedGuess}
          />
        );
      case 'POSTGAME':
        return (
          <Postgame
            lobbyData={lobbyData}
            handlePlayAgain={handlePlayAgain}
            isHost={isHost}
          />
        );
      default:
        return (
          <Lobby
            username={username}
            lobbyCode={lobbyCode}
            setUsername={setUsername}
            setLobbyCode={setLobbyCode}
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
          <PlayerList lobbyData={lobbyData} playerId={playerId} />
        </>
      )}
      {currentPhase()}
    </div>
  );
};

export default GameContainer;
