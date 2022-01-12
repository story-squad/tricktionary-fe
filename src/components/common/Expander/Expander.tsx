import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gsap } from 'gsap';
import React, { useState } from 'react';

const Expander = (props: ExpanderProps): React.ReactElement => {
  const { children, headerText, closeText, expandedDefault } = props;
  const [isExpanded, setIsExpanded] = useState(
    expandedDefault !== undefined ? expandedDefault : false,
  );

  return (
    <div className="expander">
      <button
        className="expander-header"
        onClick={() => {
          if (isExpanded) {
            gsap.to('.expander-content', {
              height: 0,
              opacity: 0,
              duration: 0.3,
            });

            setTimeout(() => {
              setIsExpanded(false);
            }, 310);
          } else {
            setIsExpanded(true);
            gsap.to('.expander-content', {
              opacity: 1,
              height: 'auto',
              duration: 0.3,
            });
          }
        }}
      >
        {headerText}{' '}
        <span className={`expander-icon${isExpanded ? ' expanded' : ''}`}>
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </button>
      <section
        className="expander-content"
        style={!expandedDefault ? { opacity: 0, height: 0 } : {}}
      >
        {isExpanded && (
          <>
            {children}
            <button
              className="secondary display-block"
              onClick={() => setIsExpanded(false)}
            >
              {closeText ? closeText : 'Close'}
            </button>
            <div className="visual-line-break" />
          </>
        )}
      </section>
    </div>
  );
};

export default Expander;

export interface ExpanderProps {
  children: React.ReactNode;
  headerText: string;
  closeText?: string;
  expandedDefault?: boolean;
}
