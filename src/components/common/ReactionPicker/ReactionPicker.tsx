import React, { useState } from 'react';
import { postReaction } from '../../../api/apiRequests';
import { ReactionItem } from '../../../types/commonTypes';
import { LobbyData } from '../../../types/gameTypes';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  const onClick = (reactionId: number) => {
    setSubmitted(true);
    postReaction({
      user_id: props.playerId,
      round_id: props.lobbyData.roundId,
      reaction_id: reactionId,
      definition_id: props.definitionId,
      game_finished: false,
    });
  };

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {props.reactions.map((reaction, key) => (
          <button
            className="reaction-btn"
            key={key}
            onClick={() => onClick(reaction.id)}
            disabled={submitted}
          >
            {reaction.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;

interface ReactionPickerProps {
  reactions: ReactionItem[];
  playerId: string;
  lobbyData: LobbyData;
  definitionId: number;
}
