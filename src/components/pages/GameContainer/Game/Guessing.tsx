import React, { useState } from 'react';
import shuffle from 'shuffle-array';
import { ReactionPicker } from '../../../common/ReactionPicker';
import {
  ReactionDefinitionIdStrings,
  ReactionItem,
} from '../../../common/ReactionPicker/ReactionPicker';

// Get a shuffled list of other players' definitions + the correct one
const getDefinitions = (
  players: any[],
  username: string,
  definition: string,
) => {
  const definitions = players
    .filter((player: any) => player.username !== username)
    .map((player: any) => {
      return {
        definition: player.definition,
        id: player.definitionId,
      };
    });
  definitions.push({ id: 0, definition });
  return shuffle(definitions);
};

const Guessing = (props: GuessingProps): React.ReactElement => {
  const {
    lobbyData,
    username,
    handleSubmitGuess,
    reactions,
    handleReactionSelection,
    submittedGuess,
  } = props;
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
          {definitions.map((definition: any) => (
            <>
              <Guess
                key={definition.id}
                definition={definition}
                handleSelectChoice={handleSelectChoice}
              />
              <ReactionPicker
                reactions={reactions}
                id={definition.id}
                cb={handleReactionSelection}
              />
            </>
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
          id={definition.id}
          name="definition"
          onChange={handleSelectChoice}
          required
        />
        <label htmlFor={definition.id}>{definition.definition}</label>
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
  handleReactionSelection: (choice: ReactionDefinitionIdStrings) => void;
  lobbyData: any;
  username: string;
  reactions: ReactionItem[];
  submittedGuess: boolean;
}

interface GuessProps {
  handleSelectChoice: (e: React.ChangeEvent<HTMLInputElement>) => void;
  definition: {
    definition: string;
    id: string;
  };
}
