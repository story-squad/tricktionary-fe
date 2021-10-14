import React from 'react';
import { Link } from 'react-router-dom';
//logo
import logo from '../../../assets/WordHoaxLogo.png';

const Header = (props: HeaderProps): React.ReactElement => {
  const { onClick, to } = props;

  return (
    <header>
      {onClick !== undefined && to !== undefined ? (
        <Link className="home-link" onClick={onClick} to={to}>
          <img className="trick-logo" src={logo} alt="Word Hoax logo" />
        </Link>
      ) : (
        <img className="trick-logo" src={logo} alt="Word Hoax logo" />
      )}
    </header>
  );
};

export default Header;

interface HeaderProps {
  onClick?: () => void;
  to?: string;
}
