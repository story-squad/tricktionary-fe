import React, { useState } from 'react';

const ReactionPicker = (props: ReactionPickerProps): React.ReactElement => {
  const { reactions, cb, id } = props;
  const [modalOn, setModalOn] = useState(false);

  const pickReaction = (reaction: number) => {
    setModalOn(false);
    cb({ reaction: `${reaction}`, id: `${id}` });
  };

  const handleSetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOn(!modalOn);
  };

  return (
    <div className="reaction-picker">
      <button onClick={handleSetModal}>Reaction Picker</button>
      {modalOn && (
        <div className="reaction-modal">
          {reactions.map((reaction) => (
            <Reaction
              key={reaction.id}
              reaction={reaction}
              pickReaction={pickReaction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Reaction = (props: ReactionProps): React.ReactElement => {
  const { reaction, pickReaction } = props;
  return (
    <button className="reaction" onClick={() => pickReaction(reaction.id)}>
      {reaction.content}
    </button>
  );
};

export default ReactionPicker;

interface ReactionPickerProps {
  reactions: ReactionItem[];
  cb: (arg0: ReactionCbItem) => void;
  id: number;
}

interface ReactionProps {
  reaction: ReactionItem;
  pickReaction: (id: number) => void;
}

export interface ReactionItem {
  id: number;
  content: string;
}

export interface ReactionCbItem {
  reaction: string;
  id: string;
}
