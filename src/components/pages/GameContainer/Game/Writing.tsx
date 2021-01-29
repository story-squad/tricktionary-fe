import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isHostState, lobbyState } from '../../../../state';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';

const Writing = (props: WritingProps): React.ReactElement => {
  const lobbyData = useRecoilValue(lobbyState);
  const isHost = useRecoilValue(isHostState);
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If Host, submit a default string. Remove when API doesn't require the host to submit a definition
  useEffect(() => {
    if (isHost) {
      props.handleSubmitDefinition('FIX THIS');
      setIsSubmitted(true);
    }
  }, []);

  const handleChangeDefinition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefinition(e.target.value);
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
      <Host>
        <p>Waiting for players to submit definitions...</p>
        <button onClick={() => props.handleSetPhase('GUESSING')}>
          Start Guessing Phase
        </button>
      </Host>
      <Player>
        {!isSubmitted && (
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
            <button disabled={definition.trim() === ''}>Submit</button>
          </form>
        )}
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
