import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
import { isHostState, lobbyCodeState, lobbyState } from '../../../state';
import {
  Guessing,
  Lobby,
  PlayerList,
  Postgame,
  Pregame,
  Writing,
} from './Game';
import { GuessItem, LobbyData } from './gameTypes';

// Create a socket connection to API
const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [isHost, setIsHost] = useRecoilState(isHostState);
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [playerId, setPlayerId] = useState('');
  const resetIsHost = useResetRecoilState(isHostState);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);

  // Combine state reset functions
  const resetGame = () => {
    resetIsHost();
    resetLobbyData();
    resetLobbyCode();
  };

  // Socket event listeners
  useEffect(() => {
    // Update game each phase, push socket data to state, push lobbyCode to URL
    socket.on('game update', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      history.push(`/${socketData.lobbyCode}`);
      console.log(socketData);
    });
    // New round with same players, retain points
    socket.on('play again', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      console.log(socketData);
    });
    // Get your playerId from the BE
    socket.on('welcome', (socketData: string) => {
      setPlayerId(socketData);
    });
    // Recieve BE errors
    socket.on('error', (errorData: string) => {
      console.log(errorData);
    });
  }, []);

  // Socket event emitters
  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username);
    setIsHost(true);
  };
  const handleJoinLobby = (e: null | React.MouseEvent, optionalCode = '') => {
    if (e) {
      e.preventDefault();
    }
    const code = optionalCode ? optionalCode : lobbyCode;
    socket.emit('join lobby', username, code);
  };
  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('start game', lobbyCode);
  };
  const handleSubmitDefinition = (definition: string) => {
    const trimmedDefinition = definition.trim();
    socket.emit('definition submitted', trimmedDefinition, lobbyCode);
  };
  const handleSubmitGuesses = (e: React.MouseEvent, guesses: GuessItem[]) => {
    e.preventDefault();
    socket.emit('guess', lobbyCode, guesses);
  };
  const handlePlayAgain = () => {
    socket.emit('play again', lobbyCode);
  };

  // Determine Game component to render based on the current game phase
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
            isHost={isHost}
            lobbyData={lobbyData}
            handleSubmitDefinition={handleSubmitDefinition}
          />
        );
      case 'GUESSING':
        return (
          <Guessing
            lobbyData={lobbyData}
            username={username}
            handleSubmitGuesses={handleSubmitGuesses}
            isHost={isHost}
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
          <Link onClick={() => resetGame()} to="/">
            Home
          </Link>
          <p className="room-code">Room Code: {lobbyCode}</p>
          <PlayerList lobbyData={lobbyData} playerId={playerId} />
        </>
      )}
      {currentPhase()}
    </div>
  );
};

export default GameContainer;
