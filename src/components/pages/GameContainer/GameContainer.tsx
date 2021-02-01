import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
import {
  guessesState,
  isHostState,
  lobbyCodeState,
  lobbySettingsState,
  lobbyState,
} from '../../../state';
import { GuessItem, LobbyData } from '../../../types/gameTypes';
import {
  Guessing,
  Lobby,
  PlayerList,
  Postgame,
  Pregame,
  Writing,
} from './Game';

// Create a socket connection to API
const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [, setIsHost] = useRecoilState(isHostState);
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [lobbySettings, setLobbySettings] = useRecoilState(lobbySettingsState);
  const [playerId, setPlayerId] = useState('');
  const resetIsHost = useResetRecoilState(isHostState);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);
  const resetGuesses = useResetRecoilState(guessesState);

  // Combine state reset functions
  const resetGame = () => {
    resetIsHost();
    resetLobbyData();
    resetLobbyCode();
    resetGuesses();
  };

  // Lobby Settings handlers
  const handleSetWord = (
    id: number,
    word: string | undefined = undefined,
    definition: string | undefined = undefined,
  ) => {
    setLobbySettings({
      ...lobbySettings,
      word: {
        id,
        word,
        definition,
      },
    });
  };

  // Socket event listeners
  useEffect(() => {
    // Update game each phase, push socket data to state, push lobbyCode to URL
    socket.on('game update', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      history.push(`/${socketData.lobbyCode}`);
    });

    // New round with same players, retain points
    socket.on('play again', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
    });

    // Get your playerId from the BE
    socket.on('welcome', (socketData: string) => {
      setPlayerId(socketData);
    });

    // Recieve BE info
    socket.on('info', (infoData: string) => {
      console.log(infoData);
    });

    // Recieve BE errors
    socket.on('error', (errorData: string) => {
      console.log(errorData);
    });
  }, []);

  // Socket event emitters
  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', 'Host');
    setIsHost(true);
  };

  const handleJoinLobby = (e: null | React.MouseEvent, optionalCode = '') => {
    if (e) {
      e.preventDefault();
    }
    socket.emit(
      'join lobby',
      username,
      optionalCode ? optionalCode : lobbyCode,
    );
  };

  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('start game', lobbySettings, lobbyCode);
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
    socket.emit('play again', lobbySettings, lobbyCode);
  };

  const handleSetPhase = (phase: string) => {
    socket.emit('set phase', phase, lobbyCode);
  };

  // Determine Game component to render based on the current game phase
  const currentPhase = () => {
    switch (lobbyData.phase) {
      case 'PREGAME':
        return (
          <Pregame
            handleStartGame={handleStartGame}
            handleSetWord={handleSetWord}
          />
        );
      case 'WRITING':
        return (
          <Writing
            handleSubmitDefinition={handleSubmitDefinition}
            handleSetPhase={handleSetPhase}
          />
        );
      case 'GUESSING':
        return (
          <Guessing
            playerId={playerId}
            handleSubmitGuesses={handleSubmitGuesses}
          />
        );
      case 'RESULTS':
        return <Postgame handlePlayAgain={handlePlayAgain} />;
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
          <Link className="home-link" onClick={() => resetGame()} to="/">
            Home
          </Link>
          <p className="room-code">Room Code: {lobbyCode}</p>
          <PlayerList playerId={playerId} />
        </>
      )}
      {currentPhase()}
    </div>
  );
};

export default GameContainer;
