import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { getWords } from '../../../../../api/apiRequests';
import { useLocalStorage } from '../../../../../hooks';
import {
  hostChoiceState,
  lobbySettingsState,
  lobbyState,
  playerIdState,
  revealResultsState,
} from '../../../../../state/gameState';
import { WordItem } from '../../../../../types/gameTypes';
import {
  MAX_CUSTOM_WORD_LENGTH,
  MAX_DEFINITION_LENGTH,
  MAX_USERNAME_LENGTH,
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
import { HowToPlay } from '../../../../common/HowTo';
import { RoomCode } from '../../../../common/RoomCode';
import { View } from '../../../../common/View';
import { WordChoice } from './WordChoice';

const initialChoiceValue = 0;
const initialCustomInputValue = { word: '', definition: '' };

const Pregame = (props: PregameProps): React.ReactElement => {
  const [isCustom, setIsCustom] = useState(false);
  const [choice, setChoice] = useState(initialChoiceValue);
  const [customInput, setCustomInput] = useState(initialCustomInputValue);
  const [showStartGameModal, setShowStartGameModal] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [wordSelection, setWordSelection] = useState<WordItem[]>([]);
  const lobbySettings = useRecoilValue(lobbySettingsState);
  const [hostChoice, setHostChoice] = useRecoilState(hostChoiceState);
  const lobbyData = useRecoilValue(lobbyState);
  const playerId = useRecoilValue(playerIdState);
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

  //* Check if the user has a default name. If so, open change name modal
  useEffect(() => {
    const isHost = lobbyData.host === playerId;

    if (props.username.includes('Player') && isHost === false) {
      setShowChangeNameModal(true);
    }
  }, [props.username]);

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomInput({
      ...customInput,
      [e.target.name]: e.target.value,
    });
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleSetSeconds(Number(e.target.value));
  };

  const handleSetUseTimer = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      props.handleSetSeconds(60);
    } else {
      props.handleSetSeconds(0);
    }
    setUseTimer(!e.target.checked);
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
    // setShowEditName(false);
    setShowChangeNameModal(false);
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

  //* Component for the change name modal
  const changePlayerName = (
    <form className="edit-name-form">
      <div className="char-counter-wrapper higher">
        <Input
          id="username"
          name="username"
          value={props.username}
          label="Codename"
          register={register}
          onChange={handleChangeUsername}
          autoFocus={true}
          maxLength={MAX_USERNAME_LENGTH}
        />
        <CharCounter string={props.username} max={MAX_USERNAME_LENGTH} />
      </div>
      <View show={errors.form != undefined}>
        <p className="short error">{errors?.form?.message}</p>
      </View>
      <button
        className="add-top-margin"
        disabled={!usernameIsValid(props.username).valid}
        onClick={handleSubmitUsername}
      >
        Save
      </button>
    </form>
  );

  return (
    <div className="pregame game-page">
      <Modal
        visible={showChangeNameModal}
        message={''}
        customJSXCode={changePlayerName}
        header={'Change your codename'}
      />

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
        <ProTip message={'Read the word before starting the game!'} />

        <h1 className="page-title">Game Setup</h1>

        <section>
          <h3>Step 1: Invite Players</h3>

          <p className="description">
            Send lobby code or copy link to invite players
          </p>

          <RoomCode />
        </section>

        <section className="white-bg">
          <h3>Step 2: Choose a word</h3>

          {/* Suggested words selection */}
          <View show={!isCustom}>
            <div className="pick-word-instructions">
              <p className="instructions bot-margin">
                Choose a word while your friends are joining the lobby. Click on
                a word to see it’s definition.
              </p>
              <button
                className="sm-btn auto-width secondary"
                onClick={handleGetWords}
              >
                give me new words
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
            <View show={getCurrentWord() != undefined}>
              <div className="word-block">
                <div className="word-definition">
                  <p className="word">{getCurrentWord()?.word}</p>
                  <p className="sm-word">Definition</p>
                  <p className="definition">{getCurrentWord()?.definition}</p>
                </div>
              </div>
            </View>
          </View>

          {/* Custom word form */}
          <View show={isCustom}>
            <p>Enter your own word and definition.</p>

            <div className="word-block">
              <div className="word-column">
                <label htmlFor="word">Word</label>
                <div className="char-counter-wrapper higher">
                  <input
                    id="word"
                    name="word"
                    value={customInput.word}
                    onChange={handleInputChange}
                    maxLength={MAX_CUSTOM_WORD_LENGTH}
                    placeholder="Type your word"
                  />
                  <CharCounter
                    string={customInput.word}
                    max={MAX_CUSTOM_WORD_LENGTH}
                  />
                </div>
                <div className="char-counter-wrapper higher">
                  <div className="form-input">
                    <label htmlFor="definition">Definition</label>
                    <textarea
                      id="definition"
                      name="definition"
                      value={customInput.definition}
                      onChange={(e) => handleTextareaChange(e)}
                      maxLength={MAX_DEFINITION_LENGTH}
                      placeholder="Type your definition"
                      rows={5}
                    ></textarea>
                  </div>

                  <CharCounter
                    string={customInput.definition}
                    max={MAX_DEFINITION_LENGTH}
                  />
                </div>
              </div>
            </div>
          </View>

          <div className="use-own-words">
            <p>
              {!isCustom ? `Don't like our words?` : `Need a creative boost?`}
            </p>
            <button
              className="choose-word sm-btn auto-width secondary"
              onClick={() => setIsCustom(!isCustom)}
            >
              {isCustom ? 'Pick One of Our Words' : 'Bring Your Own Word'}
            </button>
          </div>
        </section>

        <section className="timer-container">
          <h3>Step 3: Set A Timer</h3>
          <p className="description">
            Choose how many seconds players have to write their definitions.
          </p>

          <div className="quantity-wrapper">
            <button
              onClick={() => {
                if (lobbySettings.seconds !== undefined) {
                  props.handleSetSeconds(Number(lobbySettings.seconds - 1));
                }
              }}
              disabled={!useTimer}
            >
              -
            </button>
            <input
              className="timer-itself"
              type="number"
              min={0}
              max={120}
              value={lobbySettings.seconds}
              onChange={handleSecondsChange}
              id="seconds"
              name="seconds"
              disabled={!useTimer}
            />
            <button
              onClick={() => {
                if (lobbySettings.seconds !== undefined) {
                  props.handleSetSeconds(Number(lobbySettings.seconds + 1));
                }
              }}
              disabled={!useTimer}
            >
              +
            </button>
          </div>

          <div className="timer-wrap">
            <input
              type="checkbox"
              id="use-timer"
              checked={!useTimer}
              onChange={handleSetUseTimer}
            />
            <label htmlFor="use-timer">Play without timer</label>
          </div>
        </section>

        <section className="start-instructions white-bg">
          <h3>Important!</h3>
          <p className="description">
            Wait for all players to enter the Lobby before starting.
          </p>
          <PlayerList />
        </section>

        <section>
          <button
            disabled={!allowedToStart()}
            onClick={() => setShowStartGameModal(true)}
          >
            Start Game
          </button>
          <SetHost />
        </section>
      </Host>

      <Player>
        <ProTip message={'Definitions, like life, don’t always make sense!'} />

        <h1 className="page-title">The Lobby is filling up...</h1>

        <section className="white-bg">
          <div className="edit-name-block">
            <button
              className="sm-btn auto-width secondary"
              onClick={() => setShowChangeNameModal(true)}
            >
              Edit Name
            </button>
          </div>

          <PlayerList />
        </section>

        <section>
          <HowToPlay isExpanded={true} />
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
