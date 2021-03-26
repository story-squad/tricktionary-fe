import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  availableReactionsState,
  definitionReactionsState,
  handleSendReactionFn,
  playerIdState,
} from '../../../state';
import { getReactionCount } from '../../../utils/helpers';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const myId = useRecoilValue(playerIdState);
  const availableReactions = useRecoilValue(availableReactionsState);
  const handleSendReaction = useRecoilValue(handleSendReactionFn);
  const definitionReactions = useRecoilValue(definitionReactionsState);

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {availableReactions.map((reaction, key) => (
          <div className="reaction" key={key}>
            <button
              className="reaction-btn auto-width"
              onClick={() =>
                handleSendReaction(props.definitionId, reaction.id)
              }
              disabled={props.playerId === myId}
            >
              <span className="content">{reaction.content}</span>
            </button>
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
