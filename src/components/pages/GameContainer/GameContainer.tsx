import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
import {
  guessesState,
  lobbyCodeState,
  lobbySettingsState,
  lobbyState,
  playerIdState,
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

//Logo
import logo from '../../../assets/TricktionaryLogo.png';

// Game constants
const MAX_SECONDS = 120;

// Create a socket connection to API
const socket = io.connect(process.env.REACT_APP_API_URL as string, {
  forceNew: true,
  transports: ['polling'],
});

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useState(
    `Player${Math.floor(Math.random() * 9999)}`,
  );
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [lobbySettings, setLobbySettings] = useRecoilState(lobbySettingsState);
  const [playerId, setPlayerId] = useRecoilState(playerIdState);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);
  const resetGuesses = useResetRecoilState(guessesState);

  // Combine state reset functions
  const resetGame = () => {
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

  const handleSetSeconds = (seconds: number) => {
    seconds = Math.floor(seconds);
    if (seconds > MAX_SECONDS) {
      seconds = MAX_SECONDS;
    }
    if (seconds < 0) {
      seconds = 0;
    }
    setLobbySettings({
      ...lobbySettings,
      seconds,
    });
  };

  useEffect(() => {
    //// Socket event listeners
    // Update game each phase, push socket data to state, push lobbyCode to URL
    socket.on('game update', (socketData: LobbyData) => {
      setLobbyData(socketData);
      console.log(socketData);
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

    //// Other on-mount functions
    // Get username from localStorage if it exists
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }
  }, []);

  // Socket event emitters
  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username);
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
    if (username) {
      localStorage.setItem('username', username);
    }
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

  const handleSetHost = (hostId: string) => {
    socket.emit('set host', hostId, lobbyCode);
  };

  // Determine Game component to render based on the current game phase
  const currentPhase = () => {
    switch (lobbyData.phase) {
      case 'PREGAME':
        return (
          <Pregame
            handleStartGame={handleStartGame}
            handleSetWord={handleSetWord}
            handleSetSeconds={handleSetSeconds}
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
        return (
          <Postgame
            handlePlayAgain={handlePlayAgain}
            handleSetHost={handleSetHost}
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
    <>
      <div className="game-container">
        {lobbyData.phase !== 'LOBBY' && (
          <>
            <header>
              <Link className="home-link" onClick={() => resetGame()} to="/">
                <img className="trick-logo" src={logo} />
              </Link>
              <p>
                The game where the wrong definition could lead you to greatness.
              </p>
            </header>
            <p className="room-code">Room Code: {lobbyCode}</p>
            <PlayerList />
          </>
        )}
        {currentPhase()}
      </div>
    </>
  );
};

export default GameContainer;
