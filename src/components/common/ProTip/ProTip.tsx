import React, { useState } from 'react';
import proTips from '../../../utils/text/proTips.json';

const ProTip = (props: ProTipProps): React.ReactElement => {
  const [tipMessage] = useState(
    () => props.message || proTips[Math.floor(Math.random() * proTips.length)],
  );

  return (
    <div className="pro-tip">
      <h3>Pro Tip:</h3>
      <p>{tipMessage}</p>
    </div>
  );
};

export default ProTip;

interface ProTipProps {
  message?: string;
}
