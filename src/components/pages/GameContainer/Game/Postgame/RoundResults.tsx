import React from 'react';
import { DefinitionResultItem } from '../../../../../types/gameTypes';
import { DefinitionResult } from './DefinitionResult';

export const RoundResults = (props: RoundResultsProps): React.ReactElement => {
  const { sortedDefinitions, showReactions } = props;

  return (
    <div className="round-results">
      <section>
        <h3>Honorable Mentions</h3>
        {sortedDefinitions
          .filter((definition) => definition.points === 0)
          .map((definitionResult, key) => (
            <DefinitionResult
              key={key}
              definitionResult={definitionResult}
              showReactions={showReactions}
            />
          ))}
      </section>
      <section>
        <h3>The Ones Who Did a Bit Better</h3>
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
      <section>
        <h3>The Real Definition</h3>
        {sortedDefinitions
          .filter((definition) => definition.definitionId === 0)
          .map((definitionResult, key) => (
            <DefinitionResult
              key={key}
              definitionResult={definitionResult}
              showReactions={showReactions}
            />
          ))}
      </section>
    </div>
  );
};

interface RoundResultsProps {
  sortedDefinitions: DefinitionResultItem[];
  showReactions: boolean;
}
