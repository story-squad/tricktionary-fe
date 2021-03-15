import React from 'react';

export const WordChoice = (props: WordChoiceProps): React.ReactElement => {
  const { word, handleChoose, choice } = props;
  const className = `word-choice${word.id === choice ? ' selected' : ''}`;

  return (
    <button onClick={() => handleChoose(word.id)} className={className}>
      <p className="word">{word.word}</p>
    </button>
  );
};

interface WordChoiceProps {
  word: {
    id: number;
    word: string;
    definition: string;
  };
  handleChoose: (id: number) => void;
  choice: number;
}
