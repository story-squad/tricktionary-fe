import React from 'react';

const Postgame = (props: PostgameProps): React.ReactElement => {
  const { lobbyData, isHost, handlePlayAgain } = props;
  return (
    <div className="postgame game-page">
      <h2>Postgame</h2>
      <p>Word:</p>
      <p>{lobbyData.word}</p>
      <p>Definition:</p>
      <p>{lobbyData.definition}</p>
      {isHost && <button onClick={handlePlayAgain}>Play Again</button>}
      {!isHost && <p>Waiting on host to start new game...</p>}
    </div>
  );
};

export default Postgame;

interface PostgameProps {
  lobbyData: any;
  isHost: boolean;
  handlePlayAgain: () => void;
}
