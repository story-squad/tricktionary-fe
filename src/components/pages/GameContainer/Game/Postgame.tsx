import React from 'react';

const Postgame = (props: PostgameProps): React.ReactElement => {
  const { lobbyData, handlePlayAgain } = props;
  return (
    <div className="postgame game-page">
      <h2>Postgame</h2>
      <p>Word:</p>
      <p>{lobbyData.word}</p>
      <p>Definition:</p>
      <p>{lobbyData.definition}</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
};

export default Postgame;

interface PostgameProps {
  lobbyData: any;
  handlePlayAgain: () => void;
}
