import React, { useState } from 'react';
import { DefinitionResultItem } from '../../../../../types/gameTypes';
import { splitSortedDefinitions } from '../../../../../utils/helpers';
import { DefinitionResult } from './DefinitionResult';

export const RoundResults = (props: RoundResultsProps): React.ReactElement => {
  const { sortedDefinitions, showReactions } = props;
  const [showNoVotes, setShowNoVotes] = useState(false);
  const [noVotes, gotVotes, realDefinition] =
    splitSortedDefinitions(sortedDefinitions);

  return (
    <div className="round-results">
      {noVotes.length > 0 && (
        <section className="definition-section">
          <h3>Honorable Mentions</h3>
          <button
            className="secondary display-block"
            onClick={() => setShowNoVotes(!showNoVotes)}
          >
            {showNoVotes
              ? 'Hide Honorable Mentions'
              : 'Show Honorable Mentions'}
          </button>
          {showNoVotes ? (
            noVotes.map((definitionResult, key) => (
              <DefinitionResult
                key={key}
                definitionResult={definitionResult}
                showReactions={showReactions}
              />
            ))
          ) : (
            <div className="player-lobby add-bottom-margin">
              {noVotes.map((definitionResult, key) => (
                <div className="players" key={key}>
                  <p className="player">{definitionResult.username}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {gotVotes.length > 0 && (
        <section className="definition-section">
          <h3>The Ones Who Earned Some Votes</h3>
          {sortedDefinitions
            .filter(
              (definition) =>
                definition.points > 0 && definition.definitionId !== 0,
            )
            .map((definitionResult, key) => (
              <DefinitionResult
                key={key}
                definitionResult={definitionResult}
                showReactions={showReactions}
              />
            ))}
        </section>
      )}
      <section className="definition-section reveal-definition">
        <h3>The Real Definition</h3>
        <DefinitionResult
          definitionResult={realDefinition}
          showReactions={showReactions}
        />
      </section>
    </div>
  );
};

interface RoundResultsProps {
  sortedDefinitions: DefinitionResultItem[];
  showReactions: boolean;
}
