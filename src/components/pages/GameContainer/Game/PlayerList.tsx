import React, { useEffect, useState } from 'react';

const PlayerList = (props: PlayerListProps): React.ReactElement => {
  return (
    <div className="player-list">
      {props.players.map((player) => (
        <p key={player.id}>{player.username}</p>
      ))}
    </div>
  );
};

export default PlayerList;

interface PlayerListProps {
  players: any[];
}
