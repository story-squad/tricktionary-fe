import React from 'react';
import { Link } from 'react-router-dom';
//logo
import logo from '../../../assets/TricktionaryLogo.png';

const Header = (props: HeaderProps): React.ReactElement => {
  const { onClick } = props;

  return (
    <header>
      {onClick !== undefined ? (
        <Link className="home-link" onClick={onClick} to="/">
          <img className="trick-logo" src={logo} />
        </Link>
      ) : (
        <img className="trick-logo" src={logo} />
      )}
      <p className="welcome-word">
        The game where the wrong definition could lead you to greatness.
      </p>
    </header>
  );
};

export default Header;

interface HeaderProps {
  onClick?: () => void;
}
