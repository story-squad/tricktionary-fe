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
  playerIdState,
} from '../../../state';
import { GuessItem, LobbyData, PlayerItem } from '../../../types/gameTypes';
import { MAX_SECONDS } from '../../../utils/constants';
import { randomUsername } from '../../../utils/helpers';
import { Header } from '../../common/Header';
import { Modal } from '../../common/Modal';
import { Guessing, Lobby, Postgame, Pregame, Writing } from './Game';

// Create a socket connection to API
const socket = io.connect(process.env.REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useLocalStorage('username', randomUsername());
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [lobbySettings, setLobbySettings] = useRecoilState(lobbySettingsState);
  const [playerId, setPlayerId] = useRecoilState(playerIdState);
  const [, setGuesses] = useLocalStorage('guesses', []);
  const [localToken, setLocalToken] = useLocalStorage('token', '');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [time, setTime] = useState(-1);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);
  const hostChoice = useRecoilValue(hostChoiceState);

  // Combine reset functions
  const resetGame = () => {
    resetLobbyData();
    resetLobbyCode();
    setGuesses([]);
    socket.disconnect();
    setLocalToken('');
    handleLogin(true);
    setShowLeaveModal(false);
    history.push('/');
  };

  useEffect(() => {
    if (lobbyData.phase !== 'WRITING') {
      setTime(-1);
    }
  }, [lobbyData]);

  // For testing, DELETE later
  useEffect(() => {
    console.log(lobbyData);
  }, [lobbyData]);

  // Make a new socket connection after disconnecting
  useEffect(() => {
    socket.connect();
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
    socket.on('error', (errorData: string) => {
      console.log('error:');
      console.log(errorData);
      if (errorData === 'cool it, hackerman.') {
        history.push('/');
      }
    });

    // Get API token
    socket.on('token update', (newToken: string) => {
      setLocalToken(newToken);
    });

    socket.on('player guess', (definitionKey: number) => {
      console.log('DEFINITION KEY ', definitionKey);
    });

    socket.on('synchronize', (seconds: number) => {
      setTime(seconds);
    });
  }, []);

  // Socket event emitters
  const handleLogin = (newToken = false) => {
    socket.emit('login', newToken ? '' : localToken);
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
    console.log('right spot', hostChoice);
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

  const handleSetHost = (hostId: string) => {
    socket.emit('set host', hostId, lobbyCode);
  };

  const handleUpdateUsername = (newUsername: string) => {
    socket.emit('update username', newUsername);
  };

  // Host sends the guess # to the player to display on their screen
  const handleSendGuess = (playerId: string, definitionKey: number) => {
    socket.emit('player guess', playerId, definitionKey);
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
          />
        );
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
      <div className="game-styles">{currentPhase()}</div>
    </div>
  );
};

export default GameContainer;
