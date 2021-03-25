import React, { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { handleSendReactionFn } from '../../../state/functionState';

export const ReactionButton = (
  props: ReactionButtonProps,
): React.ReactElement => {
  const handleSendReaction = useRecoilValue(handleSendReactionFn);
  const thisButton = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    handleSendReaction(props.definitionId, props.reactionId);
    console.log(thisButton?.current);
    thisButton?.current?.blur();
  };

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
