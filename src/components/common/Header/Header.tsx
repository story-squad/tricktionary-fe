import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props: HeaderProps): React.ReactElement => {
  const { onClick, to } = props;

  return (
    <header>
      {onClick !== undefined && to !== undefined ? (
        <Link className="home-link" onClick={onClick} to={to}>
          {/* <img className="trick-logo" src={logo} alt="Word Hoax logo" /> */}
          <h2>WORD HOAX</h2>
          <p>A game of verbal cloaks, jokes & masterstrokes</p>
        </Link>
      ) : (
        // <img className="trick-logo" src={logo} alt="Word Hoax logo" />
        <>
          <h2>WORD HOAX</h2>
          <p>A game of verbal cloaks, jokes & masterstrokes</p>
        </>
      )}
    </header>
  );
};

export default Header;

interface HeaderProps {
  onClick?: () => void;
  to?: string;
}
