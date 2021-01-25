import React, { useState } from 'react';
import shuffle from 'shuffle-array';
import { Host } from '../../../common/Host';
import { Player } from '../../../common/Player';
import { DefinitionItem, LobbyData, PlayerItem } from '../gameTypes';

// Get a shuffled list of other players' definitions + the correct one
const getDefinitions = (
  players: PlayerItem[],
  username: string,
  definition: string,
) => {
  let definitions = players
    .filter((player: PlayerItem) => player.username !== username)
    .map((player: PlayerItem) => {
      return {
        content: player.definition,
        id: player.definitionId,
        definitionKey: 0,
      };
    });
  definitions.push({ id: 0, content: definition, definitionKey: 0 });
  definitions = shuffle(definitions);
  definitions = definitions.map((definition, idx) => {
    return { ...definition, definitionKey: idx + 1 };
  });
  return definitions;
};

const Guessing = (props: GuessingProps): React.ReactElement => {
  const {
    lobbyData,
    username,
    handleSubmitGuess,
    submittedGuess,
    isHost,
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
      <Host isHost={isHost}>
        <>
          <div className="definitions">
            {definitions.map((definition, key) => (
              <div key={key} className="definition">
                <span className="definition-key">
                  {definition.definitionKey}
                </span>
                <span className="definition-content">{definition.content}</span>
              </div>
            ))}
          </div>
        </>
      </Host>
      <Player isHost={isHost}>
        <></>
      </Player>
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
  isHost: boolean;
}

interface GuessProps {
  handleSelectChoice: (e: React.ChangeEvent<HTMLInputElement>) => void;
  definition: DefinitionItem;
}
