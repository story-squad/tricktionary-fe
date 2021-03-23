import React from 'react';
import { DefinitionResultItem } from '../../../../../types/gameTypes';
import { DefinitionResult } from './DefinitionResult';

export const RoundResults = (props: RoundResultsProps): React.ReactElement => {
  const { sortedDefinitions, showReactions } = props;

  return (
    <div className="round-results">
      {sortedDefinitions.map((definitionResult, key) => (
        <DefinitionResult
          key={key}
          definitionResult={definitionResult}
          showReactions={showReactions}
        />
      ))}
    </div>
  );
};

interface RoundResultsProps {
  sortedDefinitions: DefinitionResultItem[];
  showReactions: boolean;
}
