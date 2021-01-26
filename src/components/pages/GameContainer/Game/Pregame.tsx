import React, { useEffect, useState } from 'react';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';

const dummyWords = [
  {
    id: 100,
    word: 'Baz',
    definition: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
  },
  {
    id: 101,
    word: 'Foo',
    definition: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
  },
  {
    id: 102,
    word: 'Bar',
    definition: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
  },
];
const initialChoiceValue = -1;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);

  // Clear choice/input when switching between word selection type
  useEffect(() => {
    if (isCustom) {
      setChoice(-1);
    } else {
      setCustomInput({ word: '', definition: '' });
    }
  }, [isCustom]);

  // Determine the data and structure to send to API regarding word selection
  const getSelectedWord = () => {
    if (isCustom) {
      // return the custom word & definition
      return customInput;
    } else {
      // return the selected word id
      return choice;
    }
  };

  const handleChoose = (id: number) => {
    setChoice(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput({
      ...customInput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pregame game-page">
      <h2>Pregame</h2>
      <Host>
        <button
          className={`${!isCustom ? 'selected' : ''}`}
          onClick={() => setIsCustom(false)}
        >
          Choose a Word
        </button>
        <button
          className={`${isCustom ? 'selected' : ''}`}
          onClick={() => setIsCustom(true)}
        >
          Use My Own
        </button>
        {!isCustom && (
          <div className="word-list">
            {dummyWords.map((word) => (
              <WordChoice
                key={word.id}
                word={word}
                handleChoose={handleChoose}
                choice={choice}
              />
            ))}
          </div>
        )}
        {isCustom && (
          <div className="custom-word">
            <label htmlFor="word">Word:</label>
            <input
              id="word"
              name="word"
              value={customInput.word}
              onChange={handleInputChange}
            />
            <label htmlFor="definition">Definition:</label>
            <input
              id="definition"
              name="definition"
              value={customInput.definition}
              onChange={handleInputChange}
            />
          </div>
        )}
        <button onClick={props.handleStartGame}>Start</button>
      </Host>
      <Player>
        <p>Waiting on host to start...</p>
      </Player>
    </div>
  );
};

const WordChoice = (props: WordChoiceProps): React.ReactElement => {
  const { word, handleChoose, choice } = props;
  const className = `word-choice${word.id === choice ? ' selected' : ''}`;
  return (
    <button onClick={() => handleChoose(word.id)} className={className}>
      <p>{word.word}</p>
      <p>{word.definition}</p>
    </button>
  );
};

export default Pregame;

interface PregameProps {
  handleStartGame: (e: React.MouseEvent) => void;
}

interface WordChoiceProps {
  word: {
    id: number;
    word: string;
    definition: string;
  };
  handleChoose: (id: number) => void;
  choice: number;
}
