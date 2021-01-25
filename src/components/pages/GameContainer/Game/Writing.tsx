import React, { useState, useEffect } from 'react';
import { LobbyData } from '../gameTypes';

const Writing = (props: WritingProps): React.ReactElement => {
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (props.isHost) {
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
      <p>{props.lobbyData.word}</p>
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
  lobbyData: LobbyData;
  isHost: boolean;
  handleSubmitDefinition: (definition: string) => void;
}
