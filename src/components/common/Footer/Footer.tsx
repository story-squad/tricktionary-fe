import React from 'react';
import { EmailInput } from '../EmailInput';

const Footer = (): React.ReactElement => {
  return (
    <footer>
      <div className="top">
        <p className="email-disclaimer">Get email updates from Story Squad</p>
        <form id="email-update-form">
          {/* <label htmlFor="email-input">Sign up for email updates</label> */}
          <EmailInput />
        </form>
      </div>
      <div className="bottom">
        <p className="tagline">
          &quot;Human connection through creative expression.&quot;
        </p>
        <p>
          Brought to you by{' '}
          <a
            href="https://www.storysquad.app/"
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
