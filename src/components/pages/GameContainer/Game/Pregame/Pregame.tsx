import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { getWords } from '../../../../../api/apiRequests';
import { useLocalStorage } from '../../../../../hooks';
import {
  hostChoiceState,
  lobbySettingsState,
  lobbyState,
  revealResultsState,
} from '../../../../../state/gameState';
import { WordItem } from '../../../../../types/gameTypes';
import {
  MAX_CUSTOM_WORD_LENGTH,
  MAX_DEFINITION_LENGTH,
  MAX_USERNAME_LENGTH,
  REACT_APP_URL,
} from '../../../../../utils/constants';
import { hasMinimumPlayers } from '../../../../../utils/helpers';
import { initialGuesses } from '../../../../../utils/localStorageInitialValues';
import { usernameIsValid } from '../../../../../utils/validation';
import {
  CharCounter,
  Host,
  Input,
  Modal,
  Player,
  PlayerList,
  ProTip,
  SetHost,
} from '../../../../common';
import {
  HostStepOne,
  HostStepOneA,
  PlayerStepOne,
} from '../../../../common/Instructions';
import { WordChoice } from './WordChoice';

const initialChoiceValue = 0;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [showEditName, setShowEditName] = useState(false);
  const [showStartGameModal, setShowStartGameModal] = useState(false);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);
  const lobbySettings = useRecoilValue(lobbySettingsState);
  const [hostChoice, setHostChoice] = useRecoilState(hostChoiceState);
  const lobbyData = useRecoilValue(lobbyState);
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
      setChoice(0);
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

  const allowedToStart = (): boolean => {
    if (!hasMinimumPlayers(lobbyData.players)) {
      return false;
    } else if (
      isCustom &&
      customInput.word.trim() !== '' &&
      customInput.definition.trim() !== ''
    ) {
      return true;
    } else if (!isCustom && choice !== 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="pregame game-page">
      <Modal
        visible={showStartGameModal}
        message={
          'New players will not be able to join once the game has been started. Are you sure you want to start the game?'
        }
        header={'Wait!'}
        handleConfirm={props.handleStartGame}
        handleCancel={() => setShowStartGameModal(false)}
      />
      <Host>
        {/* Suggested words selection */}
        {!isCustom && (
          <section>
            <ProTip message={'Read the word before starting the game!'} />
            <h1>Step 1: Choose a Word</h1>
            <HostStepOne />
            <div className="invite-code">
              <p>Invite Code:</p>
              <p className="room-code">{lobbyData.lobbyCode}</p>
              <div className="copy-to-clipboard">
                <CopyToClipboard
                  text={`${REACT_APP_URL}/${lobbyData.lobbyCode}`}
                >
                  <FontAwesomeIcon icon={faCopy} />
                </CopyToClipboard>
              </div>
            </div>
            <div className="pick-word-instructions">
              <p className="instructions bot-margin">
                Click on a word to see its definition.
              </p>
              <button
                className="shuffle-btn sm-btn auto-width"
                onClick={handleGetWords}
              >
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
            {/* Selected word information */}
            {getCurrentWord() && (
              <div className="word-block">
                <div className="word-definition">
                  <p className="sm-word">Word:</p>
                  <p className="word">{getCurrentWord()?.word}</p>
                  <p className="sm-word">Definition:</p>
                  <p className="definition">{getCurrentWord()?.definition}</p>
                </div>
              </div>
            )}
          </section>
        )}
        {/* Custom word form */}
        {isCustom && (
          <section>
            <h1>Step 1: Bring Your Own Word</h1>
            <HostStepOneA />
            <div className="invite-code">
              <h3>Invite Code:</h3>
              <p className="room-code">{lobbyData.lobbyCode}</p>
            </div>
            <div className="word-block">
              <div className="word-column">
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
            </div>
          </section>
        )}
        <div className="use-own-words">
          <p>Don&apos;t like our words?</p>
          <button
            className="choose-word sm-btn auto-width"
            onClick={() => setIsCustom(!isCustom)}
          >
            {isCustom ? 'Pick One of Our Words' : 'Bring Your Own Word'}
          </button>
        </div>
        <section className="timer-container">
          <h3 className="timer-title">Step 2: Set A Timer</h3>
          <p className="timer-directions">
            This timer is to deterimine how long players have to type.
          </p>
          {useTimer && (
            <div className="quantity-wrapper">
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
            </div>
          )}
          <div className="timer-wrap">
            <input
              type="checkbox"
              id="use-timer"
              checked={useTimer}
              onChange={handleSetUseTimer}
            />
            <p>Play with timer</p>
          </div>
        </section>
        <section className="start-instructions">
          <h2>Important!</h2>
          <p className="instructions">
            Wait for all players to enter the Lobby before starting.
          </p>
          <PlayerList />
        </section>
        <button
          className="center align-self orange"
          disabled={!allowedToStart()}
          onClick={() => setShowStartGameModal(true)}
        >
          Start Game
        </button>
        <SetHost />
      </Host>
      <Player>
        <section>
          <ProTip
            message={'This is your chance to let your creativity shine!'}
          />
          <h1>The Lobby is filling up...</h1>
          <PlayerStepOne />
          <PlayerList />
          {!showEditName ? (
            <div className="edit-name-block">
              <button
                className="sm-btn auto-width"
                onClick={() => setShowEditName(true)}
              >
                Edit Name
              </button>
            </div>
          ) : (
            <form className="edit-name-form">
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
                <CharCounter
                  string={props.username}
                  max={MAX_USERNAME_LENGTH}
                />
              </div>
              {errors.form && (
                <p className="short error">{errors.form.message}</p>
              )}
              <button
                className="add-top-margin"
                disabled={!usernameIsValid(props.username).valid}
                onClick={handleSubmitUsername}
              >
                Confirm
              </button>
            </form>
          )}
        </section>
      </Player>
    </div>
  );
};

export default Pregame;

interface PregameProps {
  handleStartGame: () => void;
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
