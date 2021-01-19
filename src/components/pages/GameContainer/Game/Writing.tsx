import React, { useState } from 'react';

const Writing = (props: WritingProps): React.ReactElement => {
  const [definition, setDefinition] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChangeDefinition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefinition(e.target.value);
  };

  return (
    <div className="writing game-page">
      <h2>Writing</h2>
      <h3>Your Word:</h3>
      <p>{props.lobbyData.word}</p>
      {!isSubmitted && (
        <form
          onSubmit={(e) => {
            props.handleSubmitDefinition(e, definition);
            setIsSubmitted(true);
          }}
        >
          <label htmlFor="definition">Write Your Definition:</label>
          <input
            type="textfield"
            value={definition}
            onChange={handleChangeDefinition}
          />
          <button>Submit</button>
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
  lobbyData: any;
  handleSubmitDefinition: (
    e: React.FormEvent<HTMLFormElement>,
    definition: string,
  ) => void;
}
