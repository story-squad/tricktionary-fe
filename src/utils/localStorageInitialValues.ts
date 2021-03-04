import { GuessItemWithConnected, LobbyData } from '../types/gameTypes';

/* 
Put initial state values and value functions for useLocalStorage here
*/

//// Values
// "guesses"
export const initialGuesses = [];

// "token"
export const initialToken = '';

//// Functions
// Create array of player's guesses with connected status
export const getGuessesWithConnected = (
  lobbyData: LobbyData,
): GuessItemWithConnected[] =>
  lobbyData.players.map((player) => {
    return { player: player.id, guess: -1, connected: player.connected };
  });

// Create random starting username
export const randomUsername = (): string => {
  let random: number | string = Math.floor(Math.random() * 9999);
  if (random < 1000) {
    random = `0${random}`;
  }
  return `Player${random}`;
};
