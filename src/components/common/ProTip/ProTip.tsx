import React from 'react';

const ProTip = (props: ProTipProps): React.ReactElement => {
  return (
    <div className="pro-tip">
      <h3>Pro Tip:</h3>
      <p>{props.message}</p>
    </div>
  );
};

export default ProTip;

interface ProTipProps {
  message: string;
}
