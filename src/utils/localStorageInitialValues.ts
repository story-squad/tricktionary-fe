import { GuessItemWithConnected, LobbyData } from '../types/gameTypes';

// Create array of player's guesses with connected status
export const getGuessesWithConnected = (
  lobbyData: LobbyData,
): GuessItemWithConnected[] =>
  lobbyData.players.map((player) => {
    return { player: player.id, guess: -1, connected: player.connected };
  });
