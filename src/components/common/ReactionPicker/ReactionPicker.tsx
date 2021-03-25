import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  availableReactionsState,
  definitionReactionsState,
  playerIdState,
} from '../../../state/gameState';
import { getReactionCount } from '../../../utils/helpers';
import { ReactionButton } from './ReactionButton';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const myId = useRecoilValue(playerIdState);
  const availableReactions = useRecoilValue(availableReactionsState);

  const definitionReactions = useRecoilValue(definitionReactionsState);

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {availableReactions.map((reaction, key) => (
          <div className="reaction" key={key}>
            <ReactionButton
              definitionId={props.definitionId}
              reactionId={reaction.id}
              content={reaction.content}
              disabled={props.playerId === myId}
            />
            <p className="count">
              {getReactionCount(
                definitionReactions,
                props.definitionId,
                reaction.id,
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;

interface ReactionPickerProps {
  definitionId: number;
  playerId: string;
}
