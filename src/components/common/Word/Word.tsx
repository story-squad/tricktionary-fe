import React from 'react';

const Word = (props: { word: string }): React.ReactElement => {
  return (
    <div className="guess-word">
      <h2 className="word-label">The word is:</h2>
      <p className="word">{props.word}</p>
    </div>
  );
};

export default Word;
