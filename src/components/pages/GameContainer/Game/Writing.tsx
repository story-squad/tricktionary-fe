import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { lobbyState, playerIdState } from '../../../../state';
import {
  MAX_DEFINITION_LENGTH,
  MAX_SECONDS,
} from '../../../../utils/constants';
import { definitionIsValid } from '../../../../utils/validation';
import { CharCounter } from '../../../common/CharCounter';
import { Host } from '../../../common/Host';
import { Input } from '../../../common/Input';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';
import Timer from '../../../common/Timer/Timer';
import { PlayerList } from '../Game';

const Writing = (props: WritingProps): React.ReactElement => {
  const { handleSyncTimer, time, setTime } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [useTimer, setUseTimer] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const playerId = useRecoilValue(playerIdState);

  //set up the form details
  const {
    register,
    // handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    watch,
  } = useForm({
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

  const handleChangeDefinition = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="writing game-page">
      <Host>
        <h2>Players are writing their definitions...</h2>
        {useTimer && (
          <Timer
            time={time}
            setTime={setTime}
            timeUp={setTimerDone}
            syncTime={handleSyncTimer}
            addTime={handleAddTime}
          />
        )}
        <div className="guess-word">
          <p className="word-label">Your Word:</p>
          <p className="word">{lobbyData.word}</p>
        </div>
        <div className="player-display">
          <h2 className="player-h2">Players</h2>
          <PlayerList />
        </div>
        <div className="times-up-container">
          <button className="times-up-button" onClick={handleGoToNextPhase}>
            Start Guessing Phase
          </button>
          {timerDone && (
            <p className="times-up">
              Time&apos;s up for players to submit! Start the next phase.
            </p>
          )}
        </div>
        <Modal
          header={'Continue?'}
          message={modalMessage()}
          handleConfirm={() => props.handleSetPhase('GUESSING')}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
      </Host>
      <Player>
        <h2>It&apos;s Time to Get Creative!</h2>
        <p>
          When the game starts,{' '}
          <strong>
            compose your best trick defintion to get other players to vote for
            it.
          </strong>{' '}
          Click “submit” before the time runs out!
        </p>
        {useTimer && (
          <Timer
            time={time}
            setTime={setTime}
            timeUp={setTimerDone}
            syncTime={() => 0}
          />
        )}
        {!isSubmitted && timerDone && (
          <h3 className="times-up">Time&apos;s up!</h3>
        )}
        <div className="guess-word">
          <p className="word-label">Your Word:</p>
          <p className="word">{lobbyData.word}</p>
        </div>
        {!isSubmitted && !timerDone && (
          <form
            className="submit-definition"
            onSubmit={(e) => {
              handleSubmit(e, definition);
            }}
          >
            {errors.form && <div>{errors.form.message}</div>}
            <div className="char-counter-wrapper higher">
              <Input
                id="definition"
                name="definition"
                value={definition}
                label="definition"
                register={register}
                onChange={handleChangeDefinition}
                disabled={timerDone}
                autoFocus={true}
                maxLength={MAX_DEFINITION_LENGTH}
              />
              <CharCounter string={definition} max={MAX_DEFINITION_LENGTH} />
            </div>
            <br />
            <button disabled={!definitionIsValid(definition).valid}>
              Submit
            </button>
          </form>
        )}
        {isSubmitted && (
          <div className="player-submitted">
            <h3>You submitted:</h3>
            <p>{definition}</p>
          </div>
        )}
        <div className="player-display">
          <h2 className="player-h2">Players</h2>
          <PlayerList />
        </div>
      </Player>
    </div>
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
