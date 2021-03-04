import React from 'react';
import { EmailInput } from '../EmailInput';

const Footer = (): React.ReactElement => {
  return (
    <footer>
      <div className="top">
        <p className="email-disclaimer">Get email updates from Story Squad</p>
        <div id="email-update-form">
          <EmailInput />
        </div>
      </div>
      <div className="bottom">
        <p className="tagline">Human connection through creative expression</p>
        <p>
          Brought to you by{' '}
          <a
            href="https://info.tricktionary.monster/"
            target="_blank"
            rel="noreferrer"
            className="display-font"
          >
            Story Squad
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
