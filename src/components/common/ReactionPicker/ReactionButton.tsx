import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { handleSendReactionFn } from '../../../state/functionState';

export const ReactionButton = (
  props: ReactionButtonProps,
): React.ReactElement => {
  const handleSendReaction = useRecoilValue(handleSendReactionFn);
  const thisButton = useRef<HTMLButtonElement>(null);
  const [canClick, setCanClick] = useState(true);

  const handleClick = () => {
    if (canClick) {
      handleSendReaction(props.definitionId, props.reactionId);
      thisButton?.current?.blur();
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
      ref={thisButton}
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
