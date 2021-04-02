import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const Expander = (props: ExpanderProps): React.ReactElement => {
  const { children, headerText, closeText } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="expander">
      <button
        className="expander-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {headerText}{' '}
        <span className={`expander-icon${isExpanded ? ' expanded' : ''}`}>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </button>
      {isExpanded && (
        <section className="expander-content">
          {children}
          <button
            className="secondary display-block"
            onClick={() => setIsExpanded(false)}
          >
            {closeText ? closeText : 'Close'}
          </button>
          <div className="visual-line-break" />
        </section>
      )}
    </div>
  );
};

export default Expander;

export interface ExpanderProps {
  children: React.ReactNode;
  headerText: string;
  closeText?: string;
}
