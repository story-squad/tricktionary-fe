import React, { useEffect, useState } from 'react';
import { WordItem } from '../gameTypes';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import { getWords } from '../../../../api/apiRequests';

const initialChoiceValue = -1;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);

  // Get 3 word suggestions automatically
  useEffect(() => {
    handleGetWords();
  }, []);

  // Clear choice/input when switching between word selection type
  useEffect(() => {
    if (isCustom) {
      setChoice(-1);
    } else {
      setCustomInput({ word: '', definition: '' });
    }
  }, [isCustom]);

  // Update word selection in lobbySettings object
  useEffect(() => {
    if (isCustom) {
      props.handleSetWord(0, customInput.word, customInput.definition);
    } else {
      props.handleSetWord(choice, undefined, undefined);
    }
  }, [isCustom, choice, customInput]);

  const handleGetWords = () => {
    getWords()
      .then((res) => setWordSelection(res.data.words))
      .catch((err) => console.log(err));
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
            {wordSelection.map((word) => (
              <WordChoice
                key={word.id}
                word={word}
                handleChoose={handleChoose}
                choice={choice}
              />
            ))}
            <button onClick={handleGetWords}>Get New Words</button>
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
      <p className="word">{word.word}</p>
      <p className="definition">{word.definition}</p>
    </button>
  );
};

export default Pregame;

interface PregameProps {
  handleStartGame: (e: React.MouseEvent) => void;
  handleSetWord: (
    id: number,
    word: string | undefined,
    definition: string | undefined,
  ) => void;
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
