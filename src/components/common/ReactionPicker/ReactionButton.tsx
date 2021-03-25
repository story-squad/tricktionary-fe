import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { handleSendReactionFn } from '../../../state/functionState';
import { canSendReactionState } from '../../../state/gameState';

export const ReactionButton = (
  props: ReactionButtonProps,
): React.ReactElement => {
  const handleSendReaction = useRecoilValue(handleSendReactionFn);
  const [canClick, setCanClick] = useRecoilState(canSendReactionState);

  const handleClick = () => {
    if (canClick) {
      handleSendReaction(props.definitionId, props.reactionId);
      setCanClick(false);
    }
  };

  // Time-out button clicks to prevent clicking macros from running wild
  useEffect(() => {
    if (!canClick) {
      setTimeout(() => {
        setCanClick(true);
      }, 100);
    }
  }, [canClick]);

  return (
    <button
      className="reaction-btn"
      onClick={handleClick}
      disabled={props.disabled}
    >
      <span className="content">{props.content}</span>
    </button>
  );
};

interface ReactionButtonProps {
  definitionId: number;
  reactionId: number;
  content: string;
  disabled: boolean;
}
