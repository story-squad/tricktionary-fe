import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../state';
import { Host } from '../../../common/Host';
import { Modal } from '../../../common/Modal';
import { Player } from '../../../common/Player';
import Timer from '../../../common/Timer/Timer';

// simple definition validation
const definitionIsValid = (definition: string): boolean => {
  return definition.trim().length > 0 && definition.trim().length <= 250;
};

const Writing = (props: WritingProps): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChangeDefinition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefinition(e.target.value);
  };

  const handleGoToNextPhase = () => {
    if (timerDone) {
      props.handleSetPhase('GUESSING');
    } else {
      setShowModal(true);
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
      <h2>Writing</h2>
      <div className="word-display">
        <h3>Your Word:</h3>
        <p>{lobbyData.word}</p>
      </div>
      <Timer seconds={lobbyData.roundSettings.seconds} timeUp={setTimerDone} />
      <Host>
        {!timerDone && <p>Waiting for players to submit definitions...</p>}
        {timerDone && (
          <p>Time&apos;s up for players to submit! Start the next phase.</p>
        )}
        <button onClick={handleGoToNextPhase}>Start Guessing Phase</button>
        <Modal
          message={
            'There is still time on the clock. Do you want to skip to the next phase?'
          }
          handleConfirm={() => props.handleSetPhase('GUESSING')}
          handleCancel={() => setShowModal(false)}
          visible={showModal}
        />
      </Host>
      <Player>
        {!isSubmitted && !timerDone && (
          <form
            onSubmit={(e) => {
              handleSubmit(e, definition);
            }}
          >
            <label htmlFor="definition">Write Your Definition:</label>
            <br />
            <input
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
        {!isSubmitted && timerDone && <p>Time&apos;s up!</p>}
        {isSubmitted && (
          <div>
            <p>Submitted:</p>
            <p>{definition}</p>
          </div>
        )}
      </Player>
    </div>
  );
};

export default Writing;

interface WritingProps {
  handleSubmitDefinition: (definition: string) => void;
  handleSetPhase: (phase: string) => void;
}
