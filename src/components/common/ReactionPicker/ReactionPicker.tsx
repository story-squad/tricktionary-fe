import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { postReaction } from '../../../api/apiRequests';
import { lobbyState, playerIdState, reactionsState } from '../../../state';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<number>(0);
  const playerId = useRecoilValue(playerIdState);
  const lobbyData = useRecoilValue(lobbyState);
  const reactions = useRecoilValue(reactionsState);

  const className = (id: number) => {
    return `reaction-btn${selected === id ? ' selected' : ''}`;
  };

  const onClick = (reactionId: number) => {
    setSubmitted(true);
    setSelected(reactionId);
    postReaction({
      user_id: playerId,
      round_id: lobbyData.roundId,
      reaction_id: reactionId,
      definition_id: props.definitionId,
      game_finished: false,
    });
  };

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {reactions.map((reaction, key) => (
          <button
            className={className(reaction.id)}
            key={key}
            onClick={() => onClick(reaction.id)}
            disabled={submitted}
          >
            <span className="content">{reaction.content}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;

interface ReactionPickerProps {
  definitionId: number;
}
