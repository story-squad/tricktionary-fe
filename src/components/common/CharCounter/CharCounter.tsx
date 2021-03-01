import React from 'react';

const CharCounter = (props: CharCounterProps): React.ReactElement => {
  const className = () => {
    return props.max - props.string.length <= 0 ? 'full' : '';
  };

  return (
    <div className="char-counter">
      <p className={className()}>{props.max - props.string.length}</p>
    </div>
  );
};

export default CharCounter;

interface CharCounterProps {
  string: string;
  max: number;
}
