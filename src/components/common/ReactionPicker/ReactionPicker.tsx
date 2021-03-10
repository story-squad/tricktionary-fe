import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { lobbyState, playerIdState, reactionsState } from '../../../state';
import { addReaction, getReactionCount } from '../../../utils/helpers';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const myId = useRecoilValue(playerIdState);
  const reactions = useRecoilValue(reactionsState);
  const [lobbyData, setLobbyData] = useRecoilState(lobbyState);

  const onClick = (definitionId: number, reactionId: number) => {
    setLobbyData((oldLobbyData) =>
      addReaction(oldLobbyData, definitionId, reactionId),
    );
  };

  return (
    <div className="reaction-picker-container">
      <div className="reaction-picker">
        {reactions.map((reaction, key) => (
          <div className="reaction" key={key}>
            <button
              className="reaction-btn"
              onClick={() => onClick(props.definitionId, reaction.id)}
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
