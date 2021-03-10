import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { getWords } from '../../../../../api/apiRequests';
import { useLocalStorage } from '../../../../../hooks';
import {
  hostChoiceState,
  isLoadingState,
  lobbySettingsState,
  lobbyState,
  revealResultsState,
} from '../../../../../state';
import { WordItem } from '../../../../../types/gameTypes';
import {
  MAX_CUSTOM_WORD_LENGTH,
  MAX_DEFINITION_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../../../../../utils/constants';
import { hasMinimumPlayers } from '../../../../../utils/helpers';
import { initialGuesses } from '../../../../../utils/localStorageInitialValues';
import { usernameIsValid } from '../../../../../utils/validation';
import { CharCounter } from '../../../../common/CharCounter';
import { Host } from '../../../../common/Host';
import { Input } from '../../../../common/Input';
import { HostStepOne, PlayerStepOne } from '../../../../common/Instructions';
import { Player } from '../../../../common/Player';
import { PlayerList } from '../../../../common/PlayerList';
import { WordChoice } from './WordChoice';

const initialChoiceValue = -1;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [showEditName, setShowEditName] = useState(false);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);
  const lobbySettings = useRecoilValue(lobbySettingsState);
  const [hostChoice, setHostChoice] = useRecoilState(hostChoiceState);
  const lobbyData = useRecoilValue(lobbyState);
  const isLoading = useRecoilValue(isLoadingState);
  const [, setGuesses] = useLocalStorage('guesses', initialGuesses);
  const [useTimer, setUseTimer] = useState<boolean>(
    lobbySettings.seconds && lobbySettings.seconds > 0 ? true : false,
  );
  const resetRevealResults = useResetRecoilState(revealResultsState);

  const getCurrentWord = () => {
    return wordSelection.filter((word) => word.id === choice)[0];
  };

  //set up the form details
  const { register, errors, setError, clearErrors } = useForm({
    mode: 'onSubmit',
  });
  useEffect(() => {
    // Get 3 word suggestions automatically
    handleGetWords();
    // Reset previous game states
    setGuesses([]);
    resetRevealResults();
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
      .catch((err) => {
        console.log(err);
        props.setError(
          'There was an issue while getting your words. Please try again',
        );
      });
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
    const message = usernameIsValid(e.target.value).message;
    if (usernameIsValid(e.target.value).valid) {
      clearErrors();
    }
    if (!usernameIsValid(e.target.value).valid) {
      setError('form', { type: 'manual', message });
    }
  };

  const handleSubmitUsername = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEditName(false);
    props.handleUpdateUsername(props.username);
  };

  return (
    <div className="pregame game-page">
      <Host>
        <h2>Step 1: Choose a Word</h2>
        <HostStepOne />
        <div className="invite-code">
          <h3>Invite Code:</h3>
          <p className="room-code">{lobbyData.lobbyCode}</p>
        </div>
        {/* Suggested words selection */}
        {!isCustom && (
          <>
            <h3>Choose a word</h3>
            <div className="pick-word-instructions">
              <p className="pick-instructions">
                Click on a word to read its definition. If you like that word{' '}
                and your team is ready, click start!
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
              disabled={!hasMinimumPlayers(lobbyData.players) || isLoading}
            >
              Start Game
            </button>
          </div>
        )}
        {/* Custom word form */}
        {isCustom && (
          <>
            <h3 className="BYOW">Bring Your Own Word</h3>
            <p>
              While you wait for your team, please enter your word and its
              definition word. When all members have arrived, press start.
            </p>
            <div className="word-block">
              <div className="word-column col-a">
                <label htmlFor="word">Word:</label>
                <div className="char-counter-wrapper higher">
                  <input
                    id="word"
                    name="word"
                    value={customInput.word}
                    onChange={handleInputChange}
                    maxLength={MAX_CUSTOM_WORD_LENGTH}
                  />
                  <CharCounter
                    string={customInput.word}
                    max={MAX_CUSTOM_WORD_LENGTH}
                  />
                </div>
                <label htmlFor="definition">Definition:</label>
                <div className="char-counter-wrapper higher">
                  <input
                    id="definition"
                    name="definition"
                    value={customInput.definition}
                    onChange={handleInputChange}
                    maxLength={MAX_DEFINITION_LENGTH}
                  />
                  <CharCounter
                    string={customInput.definition}
                    max={MAX_DEFINITION_LENGTH}
                  />
                </div>
              </div>
              <div className="word-column col-b">
                <button
                  className="choose-word sm-btn"
                  onClick={() => setIsCustom(!isCustom)}
                >
                  {isCustom ? 'Pick One of Our Words' : 'Bring Your Own Word'}
                </button>
                <button
                  className="start-btn"
                  onClick={props.handleStartGame}
                  disabled={
                    customInput.word.trim() === '' ||
                    customInput.definition.trim() === '' ||
                    isLoading
                  }
                >
                  Start Game
                </button>
              </div>
            </div>
          </>
        )}
        <div className="timer-container">
          <h3 className="timer-title">Set A Timer</h3>
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
      </Host>
      <Player>
        <h2>The Lobby is filling up...</h2>
        <PlayerStepOne />
        {!showEditName ? (
          <div className="edit-name-block">
            <button className="sm-btn" onClick={() => setShowEditName(true)}>
              Edit Name
            </button>
          </div>
        ) : (
          <form className="edit-name-form">
            {errors.form && <p className="error">{errors.form.message}</p>}
            <div className="char-counter-wrapper higher">
              <Input
                id="username"
                name="username"
                value={props.username}
                label="Edit Name"
                register={register}
                onChange={handleChangeUsername}
                autoFocus={true}
                maxLength={MAX_USERNAME_LENGTH}
              />
              <CharCounter string={props.username} max={MAX_USERNAME_LENGTH} />
            </div>
            <button
              disabled={!usernameIsValid(props.username).valid}
              onClick={handleSubmitUsername}
            >
              Confirm
            </button>
          </form>
        )}
      </Player>
      <PlayerList />
    </div>
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
  setError: any;
}
