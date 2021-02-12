import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { lobbyState, timerState } from '../../../../state';
import { definitionIsValid } from '../../../../utils/validation';
import { Host } from '../../../common/Host';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';
import Timer from '../../../common/Timer/Timer';
import { PlayerList } from '../Game';

const Writing = (props: WritingProps): React.ReactElement => {
  const { handleSyncTimer } = props;
  const lobbyData = useRecoilValue(lobbyState);
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [useTimer, setUseTimer] = useState(false);
  const [time, setTime] = useRecoilState(timerState);
  const [timerDone, setTimerDone] = useState(false);

  // Put time on the timer
  useEffect(() => {
    if (lobbyData?.roundSettings?.seconds !== undefined) {
      console.log('LOBBY SETTINGS', lobbyData?.roundSettings?.seconds);
      setTime({
        startTime: lobbyData.roundSettings.seconds,
        currentTime: lobbyData.roundSettings.seconds,
      });
      if (lobbyData.roundSettings.seconds > 0) {
        setUseTimer(true);
      }
    }
  }, [lobbyData?.roundSettings?.seconds]);

  const allPlayersHaveWritten = () => {
    let all = true;
    const players = lobbyData.players.filter(
      (player) => player.id !== lobbyData.host,
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
  };

  const handleAddTime = (time: number, add: number) => {
    setTime({ startTime: time + add, currentTime: time + add });
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
        <h2>Your team is typing out their best definitions:</h2>
        <p>
          When the timer is up, your team will no longer be able to add to their
          definition.
        </p>
        {useTimer && (
          <Timer
            seconds={time}
            timeUp={setTimerDone}
            syncTime={handleSyncTimer}
            addTime={handleAddTime}
          />
        )}
        <PlayerList />
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
          message={modalMessage()}
          handleConfirm={() => props.handleSetPhase('GUESSING')}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
      </Host>
      <Player>
        <h2>First thought = Best thought!</h2>
        <p>
          Your host has chosen a word. Your job is to come up with a definition.
          Can you hit submit before the timer runs out?
        </p>
        {useTimer && (
          <Timer seconds={time} timeUp={setTimerDone} syncTime={() => 0} />
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
            <h2>Type out your best guess!</h2>
            {time > 0 && (
              <p>
                When the timer is up, you will no longer be able to add to your
                definition.
              </p>
            )}
            <input
              disabled={timerDone}
              id="definition"
              name="definition"
              type="textfield"
              value={definition}
              onChange={handleChangeDefinition}
            />
            <br />
            <button disabled={!definitionIsValid(definition)}>Submit</button>
          </form>
        )}
        {isSubmitted && (
          <div className="player-submitted">
            <h3>You submitted:</h3>
            <p>{definition}</p>
          </div>
        )}
        <h2 className="player-h2">Player list:</h2>
        <PlayerList />
      </Player>
    </div>
  );
};

export default Writing;

interface WritingProps {
  handleSubmitDefinition: (definition: string) => void;
  handleSetPhase: (phase: string) => void;
  handleSyncTimer: (seconds: number) => void;
}
