import React from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState, playerIdState } from '../../../state/gameState';
import { GuessItem, LobbyData, PlayerItem } from '../../../types/gameTypes';
import { isValidPlayer } from '../../../utils/helpers';

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

const playerClassName = (
  lobbyData: LobbyData,
  player: PlayerItem,
  playerId: string,
) => {
  const currentPlayer = player.id === playerId ? ' current' : '';
  const disconnectedPlayer = !player.connected ? ' disconnected' : '';
  const hasSubmitted = playerHasSubmitted(lobbyData, player)
    ? ' submitted'
    : '';

  return `players${currentPlayer}${hasSubmitted}${disconnectedPlayer}`;
};

const playerUserName = (lobbyData: LobbyData, player: PlayerItem) => {
  let username = '';
  if (lobbyData.host === player.id) {
    username += '(Host) ';
  }
  username += player.username;
  return username;
};

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  const playerId = useRecoilValue(playerIdState);
  const lobbyData = useRecoilValue(lobbyState);

  return (
    <div className="player-display">
      <h2 className="player-h2">Player Lobby</h2>
      <div className="player-lobby">
        {lobbyData.players
          .filter((player: PlayerItem) => isValidPlayer(player))
          .map((player: PlayerItem) => {
            return (
              <div
                className={playerClassName(lobbyData, player, playerId)}
                key={player.id}
              >
                <p className="player">{playerUserName(lobbyData, player)}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  hidePoints?: boolean;
}
