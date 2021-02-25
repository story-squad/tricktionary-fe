import React from 'react';
import { Link } from 'react-router-dom';

const Footer = (): React.ReactElement => {
  return (
    <footer>
      <div className="top-left">
        <p>
          Brought to you by{' '}
          <Link to="/" className="display-font">
            Story Squad
          </Link>
        </p>
        <p className="tagline">
          &quot;Human connection through creative expression.&quot;
        </p>
      </div>
      <div className="bottom-right">
        <form id="email-update-form">
          <label htmlFor="email-input">Sign up for email updates</label>
          <div className="flex-container">
            <input
              id="email-input"
              name="email-input"
              type="email"
              placeholder="Your Email"
            />
            <button>Sign Up</button>
          </div>
          <p className="email-disclaimer">
            You can opt out of your email subscription at any time.
          </p>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
