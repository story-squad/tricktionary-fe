import shuffle from 'shuffle-array';
import {
  DefinitionItem,
  GuessItem,
  GuessItemWithConnected,
  LobbyData,
  PlayerItem,
} from '../../types/gameTypes';
import { LARGE_GAME_MINIMUM_PLAYERS, MINIMUM_PLAYERS } from '../constants';

export const randomUsername = (): string => {
  let random: number | string = Math.floor(Math.random() * 9999);
  if (random < 1000) {
    random = `0${random}`;
  }
  return `Player${random}`;
};

// Check if the number of definitions submitted makes the game "large"
export const isLargeGame = (players: PlayerItem[]): boolean => {
  return (
    players.filter((player) => player.definition !== '').length >=
    LARGE_GAME_MINIMUM_PLAYERS
  );
};

// Check if the game has the required number of players.
export const hasMinimumPlayers = (players: PlayerItem[]): boolean => {
  return players.filter((player) => player.connected).length >= MINIMUM_PLAYERS;
};

// Get a shuffled list of definitions + the correct one for the Host to read off
export const getDefinitions = (
  players: PlayerItem[],
  playerId: string,
  definition: string,
): DefinitionItem[] => {
  let definitions = players
    .filter(
      (player: PlayerItem) =>
        player.id !== playerId && player.definition !== '',
    )
    .map((player: PlayerItem) => {
      return {
        content: player.definition,
        id: player.definitionId as number,
        definitionKey: 0,
      };
    });
  definitions.push({ id: 0, content: definition, definitionKey: 0 });
  definitions = shuffle(definitions);
  definitions = definitions.map((definition, idx) => {
    return { ...definition, definitionKey: idx + 1 };
  });
  return definitions;
};

// Get the player's guess from the array of all guesses
export const getPlayerGuess = (
  choices: GuessItem[],
  player: PlayerItem,
): number => {
  const found = choices.find((choice) => choice.player === player.id);
  return found?.guess as number;
};

// Recalculate guesses when players disconnect/reconnect while keeping guesses for all other players
export const recalculateGuessesWithConnected = (
  lobbyData: LobbyData,
  guesses: GuessItem[],
): GuessItemWithConnected[] => {
  const guessDict: any = {};
  const newGuesses: any = [];
  guesses.forEach((guess: any) => {
    guessDict[guess.player] = {
      guess: guess.guess,
      connected: guess.connected,
    };
  });
  lobbyData.players.forEach((player) => {
    if (guessDict.hasOwnProperty(player.id)) {
      guessDict[player.id].connected = player.connected;
    } else {
      guessDict[player.id] = {
        player: player.id,
        guess: -1,
        connected: player.connected,
      };
    }
  });
  for (const playerId in guessDict) {
    if (guessDict[playerId].connected) {
      newGuesses.push({
        player: playerId,
        guess: guessDict[playerId].guess,
        connected: guessDict[playerId].connected,
      });
    }
  }
  return newGuesses;
};

// Return true/false if all Players (not including Host) have made a guess
export const allPlayersHaveGuessed = (
  lobbyData: LobbyData,
  guesses: GuessItemWithConnected[],
): boolean => {
  let all = true;
  const playerGuesses = guesses.filter(
    (guess: GuessItem) => guess.player !== lobbyData.host,
  );
  for (let i = 0; i < playerGuesses.length; i++) {
    if (playerGuesses[i].guess === -1 && playerGuesses[i].connected) {
      all = false;
      break;
    }
  }
  return all;
};
