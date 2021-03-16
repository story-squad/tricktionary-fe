import React from 'react';
import { useRecoilValue } from 'recoil';
import {
  availableReactionsState,
  handleSendReactionFn,
  lobbyState,
  playerIdState,
} from '../../../state';
import { getReactionCount } from '../../../utils/helpers';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const myId = useRecoilValue(playerIdState);
  const availableReactions = useRecoilValue(availableReactionsState);
  const handleSendReaction = useRecoilValue(handleSendReactionFn);
  const lobbyData = useRecoilValue(lobbyState);

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {availableReactions.map((reaction, key) => (
          <div className="reaction" key={key}>
            <button
              className="reaction-btn"
              onClick={() =>
                handleSendReaction(props.definitionId, reaction.id)
              }
              disabled={props.playerId === myId}
            >
              <span className="content">{reaction.content}</span>
            </button>
            <p className="count">
              {getReactionCount(
                lobbyData.reactions,
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
