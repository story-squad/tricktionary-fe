import React from 'react';

const CharCounter = (props: CharCounterProps): React.ReactElement => {
  const className = () => {
    return props.string.length >= props.max ? 'full' : '';
  };

  return (
    <div className="char-counter">
      <p className={className()}>{`${props.string.length}/${props.max}`}</p>
    </div>
  );
};

export default CharCounter;

interface CharCounterProps {
  string: string;
  max: number;
}
