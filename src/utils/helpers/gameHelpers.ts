import { PlayerItem } from '../../types/gameTypes';
import { LARGE_GAME_MINIMUM_PLAYERS } from '../constants';

export const randomUsername = (): string => {
  let random: number | string = Math.floor(Math.random() * 9999);
  if (random < 1000) {
    random = `0${random}`;
  }
  return `Player${random}`;
};

export const isLargeGame = (players: PlayerItem[]): boolean => {
  return (
    players.filter((player) => player.connected).length >
    LARGE_GAME_MINIMUM_PLAYERS
  );
};
