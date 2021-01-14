import React from 'react';
import { Header } from '../../common/Header';

const RenderLandingPage = (): React.ReactElement => {
  return (
    <div className="landing-page">
      <Header />
      <div className="landing-content">
        <h1>Lets Play!</h1>
        <button>Join a Lobby</button>
        <button>Create New Lobby</button>
      </div>
    </div>
  );
};

export default RenderLandingPage;
