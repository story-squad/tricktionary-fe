import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const TwitterButton = (props: TwitterProps): React.ReactElement => {
  const { message } = props;
  return (
    <a
      className="twitter-share-button"
      target="_blank"
      rel="noreferrer"
      href={`https://twitter.com/intent/tweet?text=${message}`}
    >
      <FontAwesomeIcon icon={faTwitter} />
      <span>Share</span>
    </a>
  );
};

export default TwitterButton;

interface TwitterProps {
  message: string;
}
