import React from 'react';
import { Link } from 'react-router-dom';

const Header = (): React.ReactElement => {
  return (
    <>
      <header>
        <h2>
          <Link to="/">Tricktionary</Link>
        </h2>
      </header>
    </>
  );
};

export default Header;
