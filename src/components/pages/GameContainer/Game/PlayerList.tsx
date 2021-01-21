import React from 'react';
import { LobbyData, PlayerItem } from '../gameTypes';

// Functions to determine if the player has submitted, based on the current phase/lobbyData
const guessArrayContainsPlayer = (guesses: any[], playerId: string) => {
  let found = false;
  for (let i = 0; i < guesses.length; i++) {
    if (guesses[i].player === playerId) {
      found = true;
      break;
    }
  }
  return found;
};

const playerHasSubmitted = (lobbyData: any, player: PlayerItem) => {
  if (lobbyData.phase === 'WRITING' && player.definition !== '') {
    return true;
  } else if (
    lobbyData.phase === 'GUESSING' &&
    guessArrayContainsPlayer(lobbyData.guesses, player.id)
  ) {
    return true;
  } else {
    return false;
  }
};

const playerClassName = (lobbyData: any, player: PlayerItem) => {
  return `player${playerHasSubmitted(lobbyData, player) ? ' submitted' : ''}`;
};

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  const { playerId, lobbyData } = props;

  return (
    <div className="player-list">
      {lobbyData.players.map((player: PlayerItem) => {
        return (
          <p className={playerClassName(lobbyData, player)} key={player.id}>
            {`${playerId === player.id ? '(you)' : ''} ${player.username}`},
            score: {player.points}
          </p>
        );
      })}
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  lobbyData: LobbyData;
  playerId: string;
}
