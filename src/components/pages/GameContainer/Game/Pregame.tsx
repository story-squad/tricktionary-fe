import React, { useEffect, useState } from 'react';
import PlayerList from './PlayerList';

const Pregame = (props: PregameProps): React.ReactElement => {
  return (
    <div className="pregame game-page">
      <h2>Pregame</h2>
      <PlayerList players={props.lobbyData.players} />
    </div>
  );
};

export default Pregame;

interface PregameProps {
  lobbyData: any;
}
