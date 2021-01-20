import React from 'react';

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
  return (
    <div className="player-list">
      {props.lobbyData.players.map((player: PlayerItem) => {
        return (
          <p
            className={playerClassName(props.lobbyData, player)}
            key={player.id}
          >
            {player.username}, score: {player.points}
          </p>
        );
      })}
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  lobbyData: any;
}

interface PlayerItem {
  id: string;
  username: string;
  definition: string;
  points: number;
}
