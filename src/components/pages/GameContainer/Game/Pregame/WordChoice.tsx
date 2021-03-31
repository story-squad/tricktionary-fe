import React from 'react';

export const WordChoice = (props: WordChoiceProps): React.ReactElement => {
  const { word, handleChoose, choice } = props;
  const className = `word-choice selectable${
    word.id === choice ? ' selected' : ''
  }`;

  return (
    <button onClick={() => handleChoose(word.id)} className={className}>
      {word.word}
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
