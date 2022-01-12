import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import {
  loadingState,
  lobbyState,
  playerIdState,
} from '../../../../../state/gameState';
import {
  MAX_DEFINITION_LENGTH,
  MAX_SECONDS,
} from '../../../../../utils/constants';
import { definitionIsValid } from '../../../../../utils/validation';
import {
  CharCounter,
  Host,
  Modal,
  Player,
  PlayerList,
  ProTip,
  Timer,
  TwitterButton,
  View,
  Word,
} from '../../../../common';

const Writing = (props: WritingProps): React.ReactElement => {
  const { handleSyncTimer, time, setTime } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const loading = useRecoilValue(loadingState);
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [useTimer, setUseTimer] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const playerId = useRecoilValue(playerIdState);

  //set up the form details
  const { register, errors, setError, clearErrors } = useForm({
    mode: 'onSubmit',
  });

  // Put time on the timer
  useEffect(() => {
    if (lobbyData?.roundSettings?.seconds !== undefined) {
      setTime(lobbyData.roundSettings.seconds);
      if (lobbyData.roundSettings.seconds > 0) {
        setUseTimer(true);
      }
    }
  }, [lobbyData?.roundSettings?.seconds]);

  // If a player rejoins, check whether they submitted already
  useEffect(() => {
    lobbyData.players.forEach((player) => {
      if (player.id === playerId && player.definition !== '') {
        setIsSubmitted(true);
        setDefinition(player.definition);
      }
    });
  }, []);

  const allPlayersHaveWritten = () => {
    let all = true;
    const players = lobbyData.players.filter(
      (player) => player.id !== lobbyData.host && player.connected,
    );
    for (let i = 0; i < players.length; i++) {
      if (players[i].definition === '') {
        all = false;
        break;
      }
    }
    return all;
  };

  const handleChangeDefinitionTextarea = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDefinition(e.target.value);
    const message = definitionIsValid(e.target.value).message;
    if (definitionIsValid(e.target.value).valid) {
      clearErrors();
    }
    if (!definitionIsValid(e.target.value).valid) {
      setError('form', { type: 'manual', message });
    }
  };

  const handleAddTime = (time: number, add: number) => {
    let newTime = time + add;
    if (newTime > MAX_SECONDS) {
      newTime = MAX_SECONDS;
    }
    setTime(newTime);
    handleSyncTimer(newTime);
  };

  const handleGoToNextPhase = () => {
    if (timerDone || allPlayersHaveWritten()) {
      props.handleSetPhase('GUESSING');
    } else {
      setShowModal(true);
    }
  };

  const modalMessage = () => {
    if (Number(lobbyData.roundSettings.seconds) === 0) {
      return 'Not all players have submitted. Are you sure want to skip to the next phase?';
    } else {
      return 'There is still time on the clock. Are you sure want to skip to the next phase?';
    }
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | null,
    definition: string,
  ) => {
    if (e) {
      e.preventDefault();
    }
    props.handleSubmitDefinition(definition);
    setIsSubmitted(true);
  };

  return (
    <section className="writing game-page">
      <Host>
        <ProTip
          message={
            'Encourage players by saying “First Thought = Best Thought!”'
          }
        />
        <h1 className="page-title">Players are writing their definitions...</h1>

        <p className="instructions">
          If you’re playing with a timer, warn your players when they have 30,
          15, 10, and 5 seconds left
        </p>

        <section className="game-timer">
          <View show={useTimer}>
            <Timer
              time={time}
              setTime={setTime}
              timeUp={setTimerDone}
              syncTime={handleSyncTimer}
              addTime={handleAddTime}
            />
          </View>

          <div className="times-up-container">
            <View show={timerDone}>
              <p className="times-up">
                Time&apos;s up for players to submit! Start the next phase.
              </p>
            </View>
          </div>

          <Word word={lobbyData.word} />
        </section>

        <section className="white-bg">
          <PlayerList />
          <button
            className="no-bottom-margin"
            onClick={handleGoToNextPhase}
            disabled={loading === 'loading'}
          >
            Read the Definitions
          </button>
        </section>

        <Modal
          header={'Continue?'}
          message={modalMessage()}
          handleConfirm={() => props.handleSetPhase('GUESSING')}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
      </Host>
      <Player>
        <ProTip
          message={
            'Compose your best trick defintion to get other players to vote for it. Click “submit” before the time runs out!'
          }
        />

        <h1 className="page-title">It&apos;s Time to Get Creative!</h1>

        <p className="instructions">
          Compose your best trick defintion to get other players to vote for it.
          Click “submit” before the time runs out!
        </p>

        <section className="game-timer">
          <View show={useTimer}>
            <Timer
              time={time}
              setTime={setTime}
              timeUp={setTimerDone}
              syncTime={() => 0}
            />
          </View>

          <div className="times-up-container">
            <View show={!isSubmitted && timerDone}>
              <p className="times-up">Time&apos;s up!</p>
            </View>
          </div>

          <Word word={lobbyData.word} />

          <View show={!isSubmitted && !timerDone}>
            <form
              className="submit-definition"
              onSubmit={(e) => {
                handleSubmit(e, definition);
              }}
            >
              {errors.form && <div>{errors.form.message}</div>}
              <div className="char-counter-wrapper higher">
                <div className="form-input">
                  <label htmlFor="definition">Your best definition</label>
                  <textarea
                    id="definition"
                    name="definition"
                    value={definition}
                    onChange={(e) => handleChangeDefinitionTextarea(e)}
                    disabled={timerDone}
                    autoFocus={true}
                    maxLength={MAX_DEFINITION_LENGTH}
                    placeholder="Lamma Greg"
                    rows={5}
                  ></textarea>
                </div>

                <CharCounter string={definition} max={MAX_DEFINITION_LENGTH} />
              </div>
              <button
                className="align-right auto-width"
                disabled={!definitionIsValid(definition).valid}
              >
                Submit Definition
              </button>
            </form>
          </View>

          <View show={isSubmitted}>
            <div className="player-submitted">
              <h3>You submitted:</h3>
              <p className="center-text">{definition}</p>
              <TwitterButton
                message={`${lobbyData.word} means  ... or does it?`}
              />
            </div>
          </View>
        </section>

        <section className="white-bg bottom-radius">
          <PlayerList />
        </section>
      </Player>
    </section>
  );
};

export default Writing;

interface WritingProps {
  handleSubmitDefinition: (definition: string) => void;
  handleSetPhase: (phase: string) => void;
  handleSyncTimer: (seconds: number) => void;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}
