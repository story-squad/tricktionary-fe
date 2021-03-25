import React from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../../state/gameState';
import {
  DefinitionItem,
  DefinitionSelection,
  GuessItem,
  HandleSelectGuessParams,
  PlayerItem,
} from '../../../../../types/gameTypes';
import { getPlayerGuess, isLargeGame } from '../../../../../utils/helpers';

export const Guess = (props: GuessProps): React.ReactElement => {
  const { player, definitions, handleSelectGuess, guesses } = props;
  const { players } = useRecoilValue(lobbyState);

  const handleSelectWithOptions = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== 'none') {
      const params: HandleSelectGuessParams = JSON.parse(e.target.value);
      handleSelectGuess(
        params.playerId,
        params.guessId,
        params.definitionSelection,
      );
    }
  };

  const chosenDefinition = definitions.filter(
    (definition) => definition.id === getPlayerGuess(guesses, player),
  )[0]?.content;

  return (
    <>
      <div className="guess">
        <p className="guess-name">{player.username}</p>
        {!isLargeGame(players) ? (
          // Use button display for small games
          definitions.map((definition, key) => (
            <button
              className={`${
                getPlayerGuess(guesses, player) === definition.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleSelectGuess(player.id, definition.id, {
                  key: definition.definitionKey,
                  definition: definition.content,
                })
              }
              key={key}
            >
              {definition.definitionKey}
            </button>
          ))
        ) : (
          // Use select/option display for large games
          <select
            name="guess-select"
            id="guess-select"
            onChange={handleSelectWithOptions}
          >
            {
              // show default "None" option until an option is picked
              !chosenDefinition && <option value="none">None</option>
            }
            {definitions.map((definition, key) => (
              <option
                value={JSON.stringify({
                  playerId: player.id,
                  guessId: definition.id,
                  definitionSelection: {
                    key: definition.definitionKey,
                    definition: definition.content,
                  },
                })}
                key={key}
              >
                {definition.definitionKey}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="show-guess">
        {chosenDefinition && (
          <div>
            <p>Chosen Definition: </p>
            <p className="guess-choice">{chosenDefinition}</p>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

interface GuessProps {
  handleSelectGuess: (
    playerId: string,
    guessId: number,
    definitionSelection: DefinitionSelection,
  ) => void;
  definitions: DefinitionItem[];
  player: PlayerItem;
  guesses: GuessItem[];
}
