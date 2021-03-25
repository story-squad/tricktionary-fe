import React from 'react';
import { Link } from 'react-router-dom';
//logo
import logo from '../../../assets/TricktionaryLogo.png';

const Header = (props: HeaderProps): React.ReactElement => {
  const { onClick, to } = props;

  return (
    <header>
      {onClick !== undefined && to !== undefined ? (
        <Link className="home-link" onClick={onClick} to={to}>
          <img className="trick-logo" src={logo} />
        </Link>
      ) : (
        <img className="trick-logo" src={logo} alt="Tricktionary logo" />
      )}
      <p>Where the wrong definition</p>
      <p className="welcome-word">could lead you to greatness.</p>
    </header>
  );
};

export default Header;

interface HeaderProps {
  onClick?: () => void;
  to?: string;
}
