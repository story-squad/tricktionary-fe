import { PlayerItem } from '../../types/gameTypes';
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
