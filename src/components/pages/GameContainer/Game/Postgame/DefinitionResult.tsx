import React from 'react';
import { DefinitionResultItem } from '../../../../../types/gameTypes';

export const DefinitionResult = (
  props: DefinitionResultProps,
): React.ReactElement => {
  const { username, definition, points, guesses } = props.definitionResult;

  return (
    <>
      {definition !== '' ? (
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
        </div>
      ) : (
        // Player didn't submit a definition
        <div className="definition-result">
          <div className="vote-align">
            <div className="author-box">
              <span className="result-username">{username} </span>
            </div>
          </div>
          <p className="result-definition">No submission!</p>
        </div>
      )}
    </>
  );
};

interface DefinitionResultProps {
  definitionResult: DefinitionResultItem;
}
