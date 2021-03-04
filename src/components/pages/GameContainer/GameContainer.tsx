import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
import { useLocalStorage } from '../../../hooks';
import {
  hostChoiceState,
  lobbyCodeState,
  lobbySettingsState,
  lobbyState,
  playerGuessState,
  playerIdState,
  revealResultsState,
  showNewHostModalState,
} from '../../../state';
import {
  DefinitionSelection,
  GuessItem,
  LobbyData,
  PlayerItem,
} from '../../../types/gameTypes';
import { MAX_SECONDS, REACT_APP_API_URL } from '../../../utils/constants';
import { errorCodeChecker, randomUsername } from '../../../utils/helpers';
import { Header } from '../../common/Header';
import { Modal } from '../../common/Modal';
import { Finale, Guessing, Lobby, Postgame, Pregame, Writing } from './Game';

// Create a socket connection to API
const socket = io.connect(REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useLocalStorage('username', randomUsername());
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [lobbySettings, setLobbySettings] = useRecoilState(lobbySettingsState);
  const [playerId, setPlayerId] = useRecoilState(playerIdState);
  const [, setRevealResults] = useRecoilState(revealResultsState);
  const hostChoice = useRecoilValue(hostChoiceState);
  const [, setGuesses] = useLocalStorage('guesses', []);
  const [token, setToken] = useLocalStorage('token', '');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [time, setTime] = useState(-1);
  const [error, setError] = useState('');
  const [, setShowNewHostModal] = useRecoilState(showNewHostModalState);
  const [, setPlayerGuess] = useRecoilState(playerGuessState);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);
  const resetPlayerGuess = useResetRecoilState(playerGuessState);

  // Combine reset functions
  const resetGame = () => {
    resetLobbyData();
    resetLobbyCode();
    resetPlayerGuess();
    setGuesses([]);
    setRevealResults(false);
    socket.disconnect();
    setToken('');
    handleLogin(true);
    setShowLeaveModal(false);
    history.push('/');
  };

  // For testing, DELETE later
  // useEffect(() => {
  //   console.log('lobbydata', lobbyData);
  // }, [lobbyData]);

  useEffect(() => {
    if (lobbyData.phase !== 'WRITING') {
      setTime(-1);
    }
  }, [lobbyData]);

  // Make a new socket connection after disconnecting
  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }
  }, [socket.disconnected]);

  useEffect(() => {
    // Get token from localStorage if it exists, log in
    handleLogin();
    //// Socket event listeners
    // Update game each phase, push socket data to state, push lobbyCode to URL
    socket.on('game update', (socketData: LobbyData) => {
      setLobbyData(socketData);
      setLobbyCode(socketData.lobbyCode);
      history.push(`/${socketData.lobbyCode}`);
      setError('');
    });

    // Add a player to the list when they join
    socket.on('add player', (newPlayer: PlayerItem) => {
      setLobbyData((prevLobbyData) => {
        return {
          ...prevLobbyData,
          players: [...prevLobbyData.players, newPlayer],
        };
      });
    });

    // Remove a player from the list when they leave
    socket.on('remove player', (oldPlayerId: string) => {
      setLobbyData((prevLobbyData) => {
        return {
          ...prevLobbyData,
          players: prevLobbyData.players.filter(
            (player) => player.id !== oldPlayerId,
          ),
        };
      });
    });

    // Get list of players
    socket.on('player list', (playerList: PlayerItem[]) => {
      setLobbyData((prevLobbyData) => {
        return {
          ...prevLobbyData,
          players: playerList,
        };
      });
    });

    // Update a player's username when they edit their name
    socket.on('updated username', (playerId: string, newUsername: string) => {
      setLobbyData((prevLobbyData) => {
        return {
          ...prevLobbyData,
          players: prevLobbyData.players.map((player) => {
            if (player.id === playerId) {
              return { ...player, username: newUsername };
            } else {
              return player;
            }
          }),
        };
      });
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
      console.log('info:');
      console.log(infoData);
    });

    // Recieve API errors
    socket.on('error', (code: number, errorData: string) => {
      const devMessage = errorCodeChecker(code);
      console.log(
        `You have received development error code ${code} ${devMessage}`,
      );
      setError(errorData);
      if (code === 2000) {
        history.push('/');
      }
      if (code === 2000 && lobbyData.lobbyCode === '') {
        setError('');
      }
    });

    // Get API token
    socket.on('token update', (newToken: string) => {
      setToken(newToken);
    });

    socket.on('player guess', (definitionSelection: DefinitionSelection) => {
      setPlayerGuess(definitionSelection);
    });

    socket.on('synchronize', (seconds: number) => {
      setTime((prevSeconds) => {
        if (Math.abs(prevSeconds - seconds) > 2) {
          return seconds;
        } else {
          return prevSeconds;
        }
      });
    });

    socket.on('welcome host', (guesses: GuessItem[]) => {
      setGuesses(guesses);
      setShowNewHostModal(true);
    });

    socket.on('reveal results', (guesses: GuessItem[]) => {
      setGuesses(guesses);
      setRevealResults(true);
    });

    // After a disconnection occurs, refresh the game on reconnection
    socket.on('pulse check', () => {
      handleLogin();
    });
  }, []);

  // Socket event emitters
  const handleLogin = (newToken = false) => {
    socket.emit('login', newToken ? '' : token);
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
    socket.emit('start game', lobbySettings, lobbyCode, hostChoice);
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

  const handleSetFinale = () => {
    socket.emit('set finale', lobbyCode);
  };

  const handleSetHost = (hostId: string, guesses: GuessItem[]) => {
    socket.emit('set host', hostId, lobbyCode, guesses);
  };

  const handleRevealResults = (guesses: GuessItem[]) => {
    socket.emit('reveal results', lobbyCode, guesses);
  };

  const handleUpdateUsername = (newUsername: string) => {
    socket.emit('update username', newUsername);
  };

  // Host sends the guess # to the player to display on their screen
  const handleSendGuess = (
    playerId: string,
    definitionSelection: DefinitionSelection,
  ) => {
    socket.emit('player guess', playerId, definitionSelection);
  };

  const handleSyncTimer = (seconds: number) => {
    if (lobbyData.host === playerId) {
      socket.emit('synchronize', seconds);
    }
  };

  // Lobby Settings handlers / State handlers
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

  const handleSetUsername = (newUsername: string) => {
    setUsername(newUsername.trim());
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
            handleSetUsername={handleSetUsername}
            handleUpdateUsername={handleUpdateUsername}
            setError={setError}
          />
        );
      case 'WRITING':
        return (
          <Writing
            handleSubmitDefinition={handleSubmitDefinition}
            handleSetPhase={handleSetPhase}
            handleSyncTimer={handleSyncTimer}
            time={time}
            setTime={setTime}
          />
        );
      case 'GUESSING':
        return (
          <Guessing
            playerId={playerId}
            handleSubmitGuesses={handleSubmitGuesses}
            handleSendGuess={handleSendGuess}
          />
        );
      case 'RESULTS':
        return (
          <Postgame
            handlePlayAgain={handlePlayAgain}
            handleSetHost={handleSetHost}
            handleRevealResults={handleRevealResults}
            handleSetFinale={handleSetFinale}
          />
        );
      case 'FINALE':
        return <Finale />;
      default:
        return (
          <Lobby
            username={username}
            lobbyCode={lobbyCode}
            handleSetUsername={handleSetUsername}
            setLobbyCode={setLobbyCode}
            handleCreateLobby={handleCreateLobby}
            handleJoinLobby={handleJoinLobby}
          />
        );
    }
  };

  return (
    <div className="game-container">
      <Modal
        header={'HEY!'}
        message={'Would you like to leave the current game?'}
        handleConfirm={resetGame}
        handleCancel={() => setShowLeaveModal(false)}
        visible={showLeaveModal}
      />
      {lobbyData.phase === 'LOBBY' ? (
        <Header />
      ) : (
        <Header
          onClick={() => setShowLeaveModal(true)}
          to={`/${lobbyData.lobbyCode}`}
        />
      )}
      {error && <p className="outside-error">{error}</p>}
      <div className="game-styles">{currentPhase()}</div>
    </div>
  );
};

export default GameContainer;
