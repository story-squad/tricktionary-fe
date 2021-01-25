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
                <div className="definition-key">
                  <p>{definition.definitionKey}</p>
                </div>
                <p className="definition-content">{definition.content}</p>
              </div>
            ))}
          </div>
          <div className="guesses">
            {lobbyData.players.map((player, key) => (
              <Guess
                key={key}
                definitions={definitions as DefinitionItem[]}
                player={player}
                handleSelectChoice={handleSelectChoice}
              />
            ))}
          </div>
        </>
      </Host>
      <Player isHost={isHost}>
        <>
          <p>
            The host will list off the definitions and their numbers. When the
            host calls on you, choose a number.
          </p>
        </>
      </Player>
    </div>
  );
};

const Guess = (props: GuessProps): React.ReactElement => {
  const { player, definitions, handleSelectChoice } = props;
  return (
    <>
      <div className="guess">
        <p>{player.username}</p>
        {definitions.map((definition, key) => (
          <button key={key}>{definition.definitionKey}</button>
        ))}
      </div>
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
  definitions: DefinitionItem[];
  player: PlayerItem;
}
