import React from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState, playerIdState } from '../../../state';
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
  return `players${playerHasSubmitted(lobbyData, player) ? ' submitted' : ''}`;
};

const playerUserName = (
  lobbyData: LobbyData,
  player: PlayerItem,
  playerId: string,
) => {
  let username = '';
  if (player.id === playerId) {
    username += '(You) ';
  }
  if (lobbyData.host === player.id) {
    username += '(host)';
  }
  username += player.username;
  return username;
};

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  const playerId = useRecoilValue(playerIdState);
  const lobbyData = useRecoilValue(lobbyState);

  return (
    <div className="player-lobby">
      {lobbyData.players
        .filter((player: PlayerItem) => player.connected)
        .map((player: PlayerItem) => {
          return (
            <div className={playerClassName(lobbyData, player)} key={player.id}>
              <p className="player">
                {playerUserName(lobbyData, player, playerId)}
              </p>
              <p className="player-score">
                Score: {props.hidePoints ? '?' : `${player.points}`}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  hidePoints?: boolean;
}
