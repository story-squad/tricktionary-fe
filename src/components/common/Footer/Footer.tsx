import React from 'react';

const Footer = (): React.ReactElement => {
  return (
    <footer>
      <div className="top-left">
        <p>Brought to you by StorySquad</p>
        <p>Human connection through creative expression</p>
      </div>
      <div className="bottom-right">
        <p>Sign up for email updates</p>
        <form id="email-update-form">
          <label className="visually-hidden" htmlFor="email-input">
            Email Subscription Sign Up
          </label>
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
