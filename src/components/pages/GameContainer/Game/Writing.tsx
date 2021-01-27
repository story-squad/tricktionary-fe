import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isHostState, lobbyState } from '../../../../state';

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
      <h3>Your Word:</h3>
      <p>{lobbyData.word}</p>
      {!isSubmitted && (
        <form
          onSubmit={(e) => {
            handleSubmit(e, definition);
          }}
        >
          <label htmlFor="definition">Write Your Definition:</label>
          <input
            type="textfield"
            value={definition}
            onChange={handleChangeDefinition}
          />
          <button disabled={definition.trim() === ''}>Submit</button>
        </form>
      )}
      {isSubmitted && (
        <div>
          <p>Submitted:</p>
          <p>{definition}</p>
        </div>
      )}
    </div>
  );
};

export default Writing;

interface WritingProps {
  handleSubmitDefinition: (definition: string) => void;
}
