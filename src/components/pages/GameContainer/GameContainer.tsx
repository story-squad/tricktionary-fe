import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
//Logo
import logo from '../../../assets/TricktionaryLogo.png';
// local storage hook
import useLocalStorage from '../../../hooks/useLocalStorage';
import {
  guessesState,
  lobbyCodeState,
  lobbySettingsState,
  lobbyState,
  playerIdState,
} from '../../../state';
import { GuessItem, LobbyData } from '../../../types/gameTypes';
import { Guessing, Lobby, Postgame, Pregame, Writing } from './Game';

// Game constants
const MAX_SECONDS = 120;

// Create a socket connection to API
const socket = io.connect(process.env.REACT_APP_API_URL as string);

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
  const [localToken, setLocalToken] = useLocalStorage('token', '');
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
    // Get token from localStorage if it exists, log in
    handleLogin();
    //// Socket event listeners
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

    // Get your playerId from the API
    socket.on('welcome', (socketData: string) => {
      setPlayerId(socketData);
    });

    // Recieve API info
    socket.on('info', (infoData: string) => {
      console.log(infoData);
    });

    // Recieve API errors
    socket.on('error', (errorData: string) => {
      console.log(errorData);
    });

    // Get API token
    socket.on('token update', (newToken: string) => {
      setLocalToken(newToken);
    });

    //// Other on-mount functions
    // Get username from localStorage if it exists
    const localUsername = localStorage.getItem('username');
    if (localUsername) {
      setUsername(localUsername.trim());
    }
  }, []);

  // Socket event emitters
  const handleLogin = () => {
    socket.emit('login', localToken);
  };

  const handleCreateLobby = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('create lobby', username.trim());
  };

  const handleJoinLobby = (e: null | React.MouseEvent, optionalCode = '') => {
    if (e) {
      e.preventDefault();
    }
    socket.emit(
      'join lobby',
      username.trim(),
      optionalCode ? optionalCode : lobbyCode,
    );
    localStorage.setItem('username', username.trim());
  };

  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('start game', lobbySettings, lobbyCode);
  };

  const handleSubmitDefinition = (definition: string) => {
    socket.emit('definition submitted', definition.trim(), lobbyCode);
  };

  const handleSubmitGuesses = (guesses: GuessItem[]) => {
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
            username={username}
            setUsername={setUsername}
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
        {lobbyData.phase == 'LOBBY' && (
          <>
            <header>
              <img className="trick-logo" src={logo} />
              <p>
                The game where the wrong definition could lead you to greatness.
              </p>
            </header>
          </>
        )}
        {lobbyData.phase !== 'LOBBY' && (
          <>
            <header>
              <Link className="home-link" onClick={() => resetGame()} to="/">
                <img className="trick-logo" src={logo} />
              </Link>
              <p className="welcome-word">
                The game where the wrong definition could lead you to greatness.
              </p>
            </header>
          </>
        )}
        <div className="game-styles">{currentPhase()}</div>
      </div>
    </>
  );
};

export default GameContainer;
