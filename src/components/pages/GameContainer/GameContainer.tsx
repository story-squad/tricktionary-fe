import jwt from 'jsonwebtoken';
import React, { useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import io from 'socket.io-client';
import { useLocalStorage } from '../../../hooks';
import {
  definitionReactionsState,
  handleSendReactionFn,
  hostChoiceState,
  loadingState,
  lobbyCodeState,
  lobbySettingsState,
  lobbyState,
  playerGuessState,
  playerIdState,
  showNewHostModalState,
} from '../../../state';
import { handleSetHostFn } from '../../../state/handleSetHostFn';
import {
  DefinitionSelection,
  GetReactionsItem,
  GuessItem,
  LobbyData,
  PlayerItem,
} from '../../../types/gameTypes';
import {
  JWT_SECRET,
  MAX_SECONDS,
  REACT_APP_API_URL,
} from '../../../utils/constants';
import {
  addReaction,
  errorCodeChecker,
  isGhostPlayer,
  updateReactionCounts,
} from '../../../utils/helpers';
import {
  initialGuesses,
  initialToken,
  randomUsername,
} from '../../../utils/localStorageInitialValues';
import { Header, Loader, Modal } from '../../common';
import { Finale, Guessing, Lobby, Postgame, Pregame, Writing } from './Game';

// Create a socket connection to API
const socket = io.connect(REACT_APP_API_URL as string);

const GameContainer = (): React.ReactElement => {
  const history = useHistory();
  const [username, setUsername] = useLocalStorage('username', randomUsername());
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);
  const [lobbyCode, setLobbyCode] = useRecoilState(lobbyCodeState);
  const [lobbySettings, setLobbySettings] = useRecoilState(lobbySettingsState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [playerId, setPlayerId] = useRecoilState(playerIdState);
  const hostChoice = useRecoilValue(hostChoiceState);
  const [, setGuesses] = useLocalStorage('guesses', initialGuesses);
  const [token, setToken] = useLocalStorage('token', initialToken);
  const [openTabs, setOpenTabs, refreshOpenTabs] = useLocalStorage(
    'openTabs',
    initialToken,
  );
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showKickedModal, setShowKickedModal] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [time, setTime] = useState(-1);
  const [error, setError] = useState('');
  const [showNewHostModal, setShowNewHostModal] = useRecoilState(
    showNewHostModalState,
  );
  const [, setPlayerGuess] = useRecoilState(playerGuessState);
  const [, setHandleSendReactionFn] = useRecoilState(handleSendReactionFn);
  const [, setHandleSetHostFn] = useRecoilState(handleSetHostFn);
  const [, setDefinitionReactions] = useRecoilState(definitionReactionsState);
  const resetLobbyData = useResetRecoilState(lobbyState);
  const resetLobbyCode = useResetRecoilState(lobbyCodeState);
  const resetPlayerGuess = useResetRecoilState(playerGuessState);

  // Combine reset functions
  const resetGame = () => {
    history.push('/');
    resetLobbyData();
    resetLobbyCode();
    resetPlayerGuess();
    setGuesses([]);
    socket.disconnect();
    setToken(undefined);
    handleLogin(true);
    setShowLeaveModal(false);
  };

  // For testing, DELETE later
  useEffect(() => {
    console.log('--------------');
    console.log('lobbydata', lobbyData);
    console.log('playerId', playerId);
  }, [lobbyData]);

  useEffect(() => {
    // Reset timer
    if (lobbyData.phase !== 'WRITING') {
      setTime(-1);
    }
    // Remove self from game if no matching playerId
    if (isGhostPlayer(lobbyData.players, playerId)) {
      handleKickPlayer();
    }
    // Run when lobbyData is cleared after player got kicked
    if (isKicking && lobbyData.phase === 'LOBBY') {
      history.push('/');
    }
  }, [lobbyData]);

  // When app unloads, decrement tab count
  useBeforeunload(() => {
    setOpenTabs(Number(openTabs) - 1);
  });

  useEffect(() => {
    /* onMount */
    // Log in with a valid token, or get a new token if needed
    try {
      jwt.verify(token, JWT_SECRET);
      handleLogin();
    } catch (err) {
      console.log(err, 'getting new token');
      handleLogin(true);
    }
    refreshOpenTabs();

    // Keep track of the number of tabs players are using
    if (Number(openTabs) >= 0) {
      setOpenTabs(Number(openTabs) + 1);
    } else {
      setOpenTabs(1);
    }

    /* Set up Recoil-stored handler functions */
    setHandleSendReactionFn(handleSendReaction);
    setHandleSetHostFn(handleSetHost);

    /* Socket event listeners */
    // Update game each phase, push socket data to state, push lobbyCode to URL
    socket.on('game update', (socketData: LobbyData) => {
      setLoading('ok');
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
      setLoading('ok');
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
      setLoading('ok');
      console.log(
        `You have received development error code ${code}:
        ${errorData}
        ${devMessage}`,
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

    // Receive your guess from the Host
    socket.on('player guess', (definitionSelection: DefinitionSelection) => {
      setPlayerGuess(definitionSelection);
    });

    // Sync your time with the Host
    socket.on('synchronize', (seconds: number) => {
      setTime((prevSeconds) => {
        if (Math.abs(prevSeconds - seconds) > 2) {
          return seconds;
        } else {
          return prevSeconds;
        }
      });
    });

    // Become the new Host
    socket.on('welcome host', (guesses: GuessItem[]) => {
      setGuesses(guesses);
      setShowNewHostModal(true);
    });

    // Get the round results from Host when they click 'reveal'
    socket.on('reveal results', (guesses: GuessItem[]) => {
      setGuesses(guesses);
    });

    // After a disconnection occurs, refresh the game on reconnection
    socket.on('pulse check', () => {
      handleLogin();
    });

    // Update reactions when other Player clicks a reaction on RESULTS phase
    socket.on(
      'get reaction',
      (definitionId: number, reactionId: number, value: number) => {
        console.log(definitionId, reactionId, value);
        setDefinitionReactions((prevReactions) =>
          addReaction(prevReactions, definitionId, reactionId, value),
        );
      },
    );

    // Get all cumulative reactions if player refreshes during RESULTS phase
    socket.on('get reactions', (responseReactions: GetReactionsItem[]) => {
      console.log(responseReactions);
      setDefinitionReactions((reactions) =>
        updateReactionCounts(reactions, responseReactions),
      );
    });
  }, []); /* onMount */

  /* Socket event emitters */
  const handleLogin = (newToken = false) => {
    socket.emit('login', newToken ? undefined : token);
  };

  // Create game as Host
  const handleCreateLobby = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      if (socket.disconnected) {
        socket.connect();
      }
    }
    setLoading('loading');
    socket.emit('create lobby', username.trim());
  };

  // Join game as Player
  const handleJoinLobby = (e: null | React.MouseEvent, optionalCode = '') => {
    if (e) {
      e.preventDefault();
      if (socket.disconnected) {
        socket.connect();
      }
    }
    socket.emit(
      'join lobby',
      username.trim(),
      optionalCode ? optionalCode : lobbyCode,
    );
    localStorage.setItem('username', username.trim());
  };

  // Begin game as Host with a word chosen
  const handleStartGame = () => {
    setLoading('loading');
    socket.emit('start game', lobbySettings, lobbyCode, hostChoice);
  };

  const handleSubmitDefinition = (definition: string) => {
    socket.emit('definition submitted', definition.trim(), lobbyCode);
  };

  const handleSubmitGuesses = (guesses: GuessItem[]) => {
    setLoading('loading');
    socket.emit('guess', lobbyCode, guesses);
  };

  const handlePlayAgain = () => {
    setLoading('loading');
    socket.emit('play again', lobbySettings, lobbyCode);
  };

  const handleSetPhase = (phase: string) => {
    setLoading('loading');
    socket.emit('set phase', phase, lobbyCode);
  };

  const handleSetFinale = () => {
    setLoading('loading');
    socket.emit('set finale', lobbyCode);
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

  // Get cumulative definitionReactions (emoji count) on reentering the game
  const handleGetReactions = () => {
    socket.emit('get reactions');
  };

  /* 
  Recoil-stored handlers 
  Use regular function syntax to hoist 
  Return the anonymous function you want to be stored in atom 
  */
  function handleSendReaction() {
    return (definitionId: number, reactionId: number) => {
      socket.emit('send reaction', definitionId, reactionId);
    };
  }

  function handleSetHost() {
    return (hostId: string, lobbyCode: string, guesses: GuessItem[]) => {
      socket.emit('set host', hostId, lobbyCode, guesses);
    };
  }

  /* Other handlers */
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

  const handleReload = () => {
    setLoading('ok');
    location.reload();
  };

  const handleKickPlayer = () => {
    setIsKicking(true);
    resetGame();
    setShowKickedModal(true);
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
      case 'POSTGAME':
      case 'RESULTS':
        return (
          <Postgame
            handlePlayAgain={handlePlayAgain}
            handleRevealResults={handleRevealResults}
            handleSetFinale={handleSetFinale}
            handleGetReactions={handleGetReactions}
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
      <Loader />
      {/* Loader time-out */}
      <Modal
        header={'Sorry'}
        message={'There was a problem loading. Please try again.'}
        handleConfirm={handleReload}
        visible={loading === 'failed'}
        zIndex={100}
      />
      {/* Leaving the game via clicking the Header/logo */}
      <Modal
        header={'HEY!'}
        message={'Would you like to leave the current game?'}
        handleConfirm={resetGame}
        handleCancel={() => setShowLeaveModal(false)}
        visible={showLeaveModal}
      />
      {/* Warn player of multiple tabs, allow to reset value and play anyway */}
      <Modal
        header={'Already Playing'}
        message={
          'You appear to be already playing the game in another tab. Would you like to play anyway?'
        }
        handleConfirm={() => setOpenTabs(1)}
        customConfirmText={'Yes'}
        visible={Number(openTabs) > 1}
      />
      {/* Lost connection or got kicked */}
      <Modal
        header={'Connection Lost'}
        message={'You lost connection to the game.'}
        handleConfirm={() => setShowKickedModal(false)}
        visible={showKickedModal}
      />
      {/* You became the host */}
      <Modal
        header={'Host Changed'}
        message={'You are now the Host.'}
        visible={showNewHostModal}
        handleConfirm={() => setShowNewHostModal(false)}
      />
      {/* Make the header clickable if not in the Lobby */}
      {lobbyData.phase === 'LOBBY' ? (
        <Header />
      ) : (
        <Header
          onClick={() => setShowLeaveModal(true)}
          to={`/${lobbyData.lobbyCode}`}
        />
      )}
      {/* Error display */}
      {error && <p className="outside-error">{error}</p>}
      {/* Game component */}
      <div className="game-styles">{currentPhase()}</div>
    </div>
  );
};

export default GameContainer;
