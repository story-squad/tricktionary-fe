import React from 'react';

const Pregame = (props: PregameProps): React.ReactElement => {
  return (
    <div className="pregame game-page">
      <h2>Pregame</h2>
      {props.isHost && <button onClick={props.handleStartGame}>Start</button>}
    </div>
  );
};

export default Pregame;

interface PregameProps {
  lobbyData: any;
  isHost: boolean;
  handleStartGame: (e: React.MouseEvent) => void;
}
