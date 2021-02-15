import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getWords } from '../../../../api/apiRequests';
import { useLocalStorage } from '../../../../hooks';
import {
  hostChoiceState,
  lobbySettingsState,
  lobbyState,
} from '../../../../state';
//styles
import '../../../../styles/components/pages/Pregame.scss';
import { WordItem } from '../../../../types/gameTypes';
import { usernameIsValid } from '../../../../utils/validation';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import { PlayerList } from '../Game';

const initialChoiceValue = -1;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [showEditName, setShowEditName] = useState(false);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);
  const lobbySettings = useRecoilValue(lobbySettingsState);
  const lobbyData = useRecoilValue(lobbyState);
  const [, setGuesses] = useLocalStorage('guesses', []);
  const [useTimer, setUseTimer] = useState<boolean>(
    lobbySettings.seconds && lobbySettings.seconds > 0 ? true : false,
  );
  const [hostChoice, setHostChoice] = useRecoilState(hostChoiceState);

  const getCurrentWord = () => {
    return wordSelection.filter((word) => word.id === choice)[0];
  };

  // Get 3 word suggestions automatically, reset guesses array from previous game
  useEffect(() => {
    handleGetWords();
    setGuesses([]);
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
      .then((res) => {
        setWordSelection(res.data.words);
        setHostChoice({
          word_id_one: 0,
          word_id_two: 0,
          times_shuffled: hostChoice.times_shuffled + 1,
        });
        setChoice(0);
      })
      .catch((err) => console.log(err));
  };

  const handleChoose = (id: number) => {
    setChoice(id);
    const not_chosen_list = wordSelection.filter((word) => word.id !== id);
    if (not_chosen_list.length > 1) {
      setHostChoice({
        ...hostChoice,
        word_id_one: not_chosen_list[0].id,
        word_id_two: not_chosen_list[1].id,
      });
    }
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

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleSetUsername(e.target.value);
  };

  const handleSubmitUsername = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEditName(false);
    props.handleUpdateUsername(props.username);
  };

  return (
    <div className="pregame game-page">
      <Host>
        <h2>Pregame Settings</h2>
        <p className="welcome-word">
          Invite your friends, pick a word, set the timer, start the game!
        </p>
        <div className="invite-code">
          <h3>Invite Code:</h3>
          <p className="room-code">{lobbyData.lobbyCode}</p>
        </div>
        {/* Word selection */}
        {!isCustom && (
          <>
            <h3>Choose a word!</h3>
            <div className="pick-word-instructions">
              <p className="pick-instructions">
                Click on a word to read its definition. If you like that word{' '}
                <i>and</i> your team is ready, click start!
              </p>
              <button className="shuffle-btn sm-btn" onClick={handleGetWords}>
                Shuffle Words
              </button>
            </div>
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
            <p className="or">- OR -</p>
            <button
              className="choose-word sm-btn"
              onClick={() => setIsCustom(!isCustom)}
            >
              {isCustom ? 'Pick One of Our Words' : 'Bring Your Own Word'}
            </button>
          </>
        )}
        {/* Selected word information */}
        {!isCustom && getCurrentWord() && (
          <div className="word-block">
            <div className="word-definition">
              <p className="sm-word">Word:</p>
              <p className="word">{getCurrentWord()?.word}</p>
              <p className="sm-word">Definition:</p>
              <p className="definition">{getCurrentWord()?.definition}</p>
            </div>
            <button
              className="start-btn center"
              onClick={props.handleStartGame}
            >
              Start Game!
            </button>
          </div>
        )}
        {/* Custom word form */}
        {isCustom && (
          <>
            <h2 className="BYOW">Bring Your Own Word!</h2>
            <p>
              While you wait for your team, please enter your word and its
              definition word. When all members have arrived, press start.
            </p>
            <div className="word-block">
              <div className="word-column col-a">
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
              <div className="word-column col-b">
                <button
                  className="choose-word sm-btn"
                  onClick={() => setIsCustom(!isCustom)}
                >
                  {isCustom ? 'Pick One of Our Words' : 'Bring Your Own Word'}
                </button>
                <button className="start-btn" onClick={props.handleStartGame}>
                  Start Game!
                </button>
              </div>
            </div>
          </>
        )}
        <div className="timer-container">
          <h3 className="timer-title">Set A Timer!</h3>
          <p className="timer-directions">
            This timer is to deterimine how long players have to type.
          </p>
          {useTimer && (
            <>
              <input
                className="timer-itself"
                type="number"
                min={0}
                max={120}
                value={lobbySettings.seconds}
                onChange={handleSecondsChange}
                id="seconds"
                name="seconds"
              />
            </>
          )}
          <div className="timer-wrap">
            <input
              type="checkbox"
              id="use-timer"
              checked={useTimer}
              onChange={handleSetUseTimer}
            />
            <p>Play with a timer</p>
          </div>
        </div>
        <h2 className="player-h2">Player Lobby</h2>
        <PlayerList />
      </Host>
      <Player>
        <h2>Waiting for your team to join...</h2>
        {!showEditName && (
          <div className="edit-name-block">
            <button className="sm-btn" onClick={() => setShowEditName(true)}>
              Edit Name
            </button>
          </div>
        )}{' '}
        {showEditName && (
          <form className="edit-name-form">
            <label htmlFor="edit-name">Edit Name</label>
            <input
              id="edit-name"
              name="edit-name"
              value={props.username}
              onChange={handleChangeUsername}
            ></input>
            <button
              disabled={!usernameIsValid(props.username)}
              onClick={handleSubmitUsername}
            >
              Confirm
            </button>
          </form>
        )}
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
  handleSetUsername: (newUsername: string) => void;
  username: string;
  handleUpdateUsername: (newUsername: string) => void;
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
