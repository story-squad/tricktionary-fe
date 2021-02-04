import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getWords } from '../../../../api/apiRequests';
import { lobbySettingsState, lobbyState } from '../../../../state';
//styles
import '../../../../styles/components/pages/Pregame.scss';
import { WordItem } from '../../../../types/gameTypes';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import { PlayerList } from '../Game';

const initialChoiceValue = -1;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);
  const lobbySettings = useRecoilValue(lobbySettingsState);
  const lobbyData = useRecoilValue(lobbyState);
  const [useTimer, setUseTimer] = useState<boolean>(
    lobbySettings.seconds && lobbySettings.seconds > 0 ? true : false,
  );

  console.log('Word Info:', wordSelection);

  const getCurrentWord = () =>
    wordSelection.filter((word) => word.id === choice)[0];

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

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleSetSeconds(Number(e.target.value));
  };

  const handleSetUseTimer = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      props.handleSetSeconds(60);
    } else {
      props.handleSetSeconds(0);
    }
    setUseTimer(e.target.checked);
  };

  return (
    <div className="pregame game-page">
      <Host>
        <p className="room-code">Room Code: {lobbyData.lobbyCode}</p>
        <h2>Please choose a word!</h2>
        <p>
          While you wait for your team, please pick a word. When all members
          have arrived, press start.
        </p>

        {/* Word selection */}
        {!isCustom && (
          <>
            <button className="shuffle-btn sm-btn" onClick={handleGetWords}>
              Shuffle Words
            </button>
            <div className="word-list">
              {wordSelection.map((word) => (
                <WordChoice
                  key={word.id}
                  word={word}
                  handleChoose={handleChoose}
                  choice={choice}
                />
              ))}
            </div>
          </>
        )}
        <button onClick={() => setIsCustom(!isCustom)}>
          {isCustom ? 'Choose a Word' : 'Bring Your Own Word'}
        </button>
        {/* Selected word information */}
        {!isCustom && getCurrentWord() && (
          <div>
            <p>Word:</p>
            <p>{getCurrentWord()?.word}</p>
            <p>Definition:</p>
            <p>{getCurrentWord()?.definition}</p>
            <button onClick={props.handleStartGame}>Start</button>
          </div>
        )}
        {/* Custom word form */}
        {isCustom && (
          <div className="custom-word">
            <label htmlFor="word">Word:</label>
            <input
              id="word"
              name="word"
              value={customInput.word}
              onChange={handleInputChange}
            />
            <br />
            <label htmlFor="definition">Definition:</label>
            <input
              id="definition"
              name="definition"
              value={customInput.definition}
              onChange={handleInputChange}
            />
            <button onClick={props.handleStartGame}>Start</button>
          </div>
        )}
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
        <input
          type="checkbox"
          id="use-timer"
          checked={useTimer}
          onChange={handleSetUseTimer}
        />
        <label htmlFor="use-timer">Use Timer</label>
        <br />
        {useTimer && (
          <>
            <input
              type="number"
              min={0}
              max={120}
              value={lobbySettings.seconds}
              onChange={handleSecondsChange}
              id="seconds"
              name="seconds"
            />
            <label htmlFor="seconds">Seconds to Submit Definition</label>
            <br />
          </>
        )}

        <PlayerList />
      </Host>
      <Player>
        <h2>Please choose a word!</h2>
        <p>
          While you wait for your team, please pick a word. When all members
          have arrived, press start.
        </p>
        <p>Waiting on host to start...</p>
        <PlayerList />
      </Player>
    </div>
  );
};

const WordChoice = (props: WordChoiceProps): React.ReactElement => {
  const { word, handleChoose, choice } = props;
  const className = `word-choice${word.id === choice ? ' selected' : ''}`;
  return (
    <>
      <button onClick={() => handleChoose(word.id)} className={className}>
        <p className="word">{word.word}</p>
      </button>
      {/* <p className="definition">{word.definition}</p> */}
    </>
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
  handleSetSeconds: (seconds: number) => void;
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
