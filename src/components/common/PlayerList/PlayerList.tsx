import React from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../state';
import { GuessItem, LobbyData, PlayerItem } from '../../../types/gameTypes';

// Functions to determine if the player has submitted, based on the current phase/lobbyData
const guessArrayContainsPlayer = (guesses: GuessItem[], playerId: string) => {
  let found = false;
  for (let i = 0; i < guesses.length; i++) {
    if (guesses[i].player === playerId) {
      found = true;
      break;
    }
  }
  return found;
};

const playerHasSubmitted = (lobbyData: LobbyData, player: PlayerItem) => {
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

const playerClassName = (lobbyData: LobbyData, player: PlayerItem) => {
  return `player${playerHasSubmitted(lobbyData, player) ? ' submitted' : ''}`;
};

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  const { playerId } = props;
  const lobbyData = useRecoilValue(lobbyState);

  return (
    <div className="player-list">
      <h2>Players</h2>
      {lobbyData.players
        .filter((player: PlayerItem) => player.id !== lobbyData.host)
        .map((player: PlayerItem) => {
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
  playerId: string;
}
