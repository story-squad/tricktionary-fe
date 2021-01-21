import React, { useState } from 'react';
import shuffle from 'shuffle-array';
import { DefinitionItem, LobbyData, PlayerItem } from '../gameTypes';

// Get a shuffled list of other players' definitions + the correct one
const getDefinitions = (
  players: PlayerItem[],
  username: string,
  definition: string,
) => {
  const definitions = players
    .filter((player: PlayerItem) => player.username !== username)
    .map((player: PlayerItem) => {
      return {
        content: player.definition,
        id: player.definitionId,
      };
    });
  definitions.push({ id: 0, content: definition });
  return shuffle(definitions);
};

const Guessing = (props: GuessingProps): React.ReactElement => {
  const { lobbyData, username, handleSubmitGuess, submittedGuess } = props;
  // Call getDefinitions to set state. Invoking getDefinitions outside of state causes re-shuffling of the list on selction
  const [definitions] = useState(
    getDefinitions(lobbyData.players, username, lobbyData.definition),
  );
  const [choice, setChoice] = useState('');

  const handleSelectChoice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChoice(e.target.id);
  };

  return (
    <div className="guessing game-page">
      <h2>Guessing</h2>
      <p>Word: {lobbyData.word}</p>
      {!submittedGuess && (
        <form onSubmit={(e) => handleSubmitGuess(e, choice)}>
          {definitions.map((definition) => (
            <Guess
              key={definition.id}
              definition={definition as DefinitionItem}
              handleSelectChoice={handleSelectChoice}
            />
          ))}
          <button>Enter Guess</button>
        </form>
      )}
      {submittedGuess && <p>Waiting on other players to guess...</p>}
    </div>
  );
};

const Guess = (props: GuessProps): React.ReactElement => {
  const { definition, handleSelectChoice } = props;
  return (
    <>
      <div className="guess">
        <input
          type="radio"
          id={String(definition.id)}
          name="definition"
          onChange={handleSelectChoice}
          required
        />
        <label htmlFor={String(definition.id)}>{definition.content}</label>
      </div>
      <br />
    </>
  );
};

export default Guessing;

interface GuessingProps {
  handleSubmitGuess: (
    e: React.FormEvent<HTMLFormElement>,
    guess: string,
  ) => void;
  lobbyData: LobbyData;
  username: string;
  submittedGuess: boolean;
}

interface GuessProps {
  handleSelectChoice: (e: React.ChangeEvent<HTMLInputElement>) => void;
  definition: DefinitionItem;
}
