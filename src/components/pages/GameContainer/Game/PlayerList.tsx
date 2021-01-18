import React from 'react';

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  return (
    <div className="player-list">
      {props.players.map((player: PlayerItem) => (
        <p key={player.id}>{player.username}</p>
      ))}
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  players: any[];
}

interface PlayerItem {
  id: string;
  username: string;
}
