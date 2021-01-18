import React, { useState } from 'react';

const Writing = (props: WritingProps): React.ReactElement => {
  const [definition, setDefinition] = useState('');

  const handleChangeDefinition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefinition(e.target.value);
  };

  return (
    <div className="pregame game-page">
      <h2>Writing</h2>
      <form>
        <label htmlFor="definition">Write Your Definition:</label>
        <input
          type="textfield"
          value={definition}
          onChange={handleChangeDefinition}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Writing;

interface WritingProps {
  lobbyData: any;
}
