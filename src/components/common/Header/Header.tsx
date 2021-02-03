import React from 'react';
import { Link } from 'react-router-dom';
import resetGame from '../../pages/GameContainer/GameContainer';
//logo
import logo from '../../../assets/TricktionaryLogo.png';


const Header = (): React.ReactElement => {
  return (
    <>
      <header>
        <Link className="home-link" onClick={() => resetGame()} to="/">
          <img className="trick-logo" src={logo} />
        </Link>
        <p>The game where the wrong definition could lead you to greatness.</p>
      </header>
    </>
  );
};

export default Header;
