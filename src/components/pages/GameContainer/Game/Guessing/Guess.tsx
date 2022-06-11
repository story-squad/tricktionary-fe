import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { lobbyState } from '../../../../../state/gameState';
import {
  BotItem,
  DefinitionItem,
  DefinitionSelection,
  GuessItem,
  HandleSelectGuessParams,
  PlayerItem,
} from '../../../../../types/gameTypes';
import { getPlayerGuess, isLargeGame } from '../../../../../utils/helpers';
import { Modal } from '../../../../common';

export const Guess = (props: GuessProps): React.ReactElement => {
  const { player, definitions, handleSelectGuess, guesses, lobbyData } = props;
  const { players } = useRecoilValue(lobbyState);
  const [showBotGuessModal, setShowBotGuessModal] = useState(false);
  const [botGuess, setBotGuess] = useState('');

  //* This will be used for the bot guess response API
  useEffect(() => {
    if (
      lobbyData.bots.filter((e: BotItem) => e.botName === player.username)
        .length > 0
    ) {
      // Set the array for bot guesses
      let filteredBotDefinitions = [...definitions];

      // Remove actual word definition from guesses
      filteredBotDefinitions = filteredBotDefinitions.filter(
        (definition) => definition.content !== lobbyData.definition,
      );

      // Remove the bot's own definition from the list
      filteredBotDefinitions = filteredBotDefinitions.filter(
        (definition) => definition.content !== player.definition,
      );

      //Just make the array be the definitions, not the object
      filteredBotDefinitions = filteredBotDefinitions.map((definition: any) => {
        return definition.content;
      });

      // Format the definitions array to be properly used with the API
      let formattedList;

      if (filteredBotDefinitions.length > 0) {
        formattedList = filteredBotDefinitions.join('*');
      } else {
        formattedList = '';
      }

      const APIURL = `https://hoaxbot3000.herokuapp.com/zetabot/guess/${lobbyData.word}/${formattedList}/${player.username}`;

      axios
        .get(APIURL)
        .then((res) => {
          console.log('Guess.tsx - line 61 - bot response', res);
          setBotGuess(`${res.data}`);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, []);

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

  const handleTextToSpeech = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en';
    speech.text = botGuess;
    speech.volume = 0.8;
    speech.rate = 0.6;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  return (
    <>
      <div className="guess row">
        <div className="guess-name">
          {lobbyData.bots.filter((e: BotItem) => e.botName === player.username)
            .length > 0 ? (
            <>
              {player.username}{' '}
              {botGuess !== '' && (
                <>
                  <button
                    onClick={() => setShowBotGuessModal(true)}
                    className="open-guess"
                  >
                    G
                  </button>
                  <Modal
                    visible={showBotGuessModal}
                    message={botGuess}
                    header={`${player.username}`}
                    customConfirmText="Speak"
                    customCancelText="Close"
                    handleCancel={() => setShowBotGuessModal(false)}
                    handleConfirm={handleTextToSpeech}
                  />
                </>
              )}
            </>
          ) : (
            player.username
          )}
        </div>
        {!isLargeGame(players) ? (
          // Use button display for small games
          <div className="guess-vote">
            {definitions.map((definition, key) => (
              <button
                className={`selectable ${
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
            ))}
          </div>
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

        <div className="word-block">
          {chosenDefinition && (
            <div className="word-definition">
              <p className="sm-word">Definition</p>
              <p className="definition">{chosenDefinition}</p>
            </div>
          )}
        </div>
      </div>
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
  lobbyData: any;
}
