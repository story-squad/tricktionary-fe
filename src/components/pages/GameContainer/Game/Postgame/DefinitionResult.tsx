import React from 'react';
import { DefinitionResultItem } from '../../../../../types/gameTypes';
import { ReactionPicker } from '../../../../common/ReactionPicker';

export const DefinitionResult = (
  props: DefinitionResultProps,
): React.ReactElement => {
  const {
    username,
    playerId,
    definition,
    points,
    guesses,
    definitionId,
  } = props.definitionResult;
  const { showReactions } = props;

  return (
    <>
      {definition !== '' && (
        // Player submitted a definition
        <div className="definition-result">
          <div className="vote-align">
            <div className="author-box">
              <span className="result-username">{username} </span>
              <span>wrote:</span>
            </div>
            <p className="result-votes">
              {points} vote{points === 1 ? '' : 's'}
            </p>
          </div>
          <p className="result-definition">{definition}</p>
          <p className="who-voted-p">
            {guesses.length > 0 ? 'Who voted:' : 'No votes'}
          </p>
          <div className="who-voted-box">
            {guesses.map((guess, key) => (
              <div key={key} className="guess-names">
                <p className="who-voted">{guess}</p>
              </div>
            ))}
          </div>
          {showReactions && definitionId !== 0 && (
            <ReactionPicker definitionId={definitionId} playerId={playerId} />
          )}
        </div>
      )}
    </>
  );
};

interface DefinitionResultProps {
  definitionResult: DefinitionResultItem;
  showReactions?: boolean;
}
