import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { CookiePopup } from './components/common/CookiePopup';
import { GameContainer } from './components/pages/GameContainer';

const App = (): React.ReactElement => {
  return (
    <div className="App">
      <CookiePopup />
      <Switch>
        <Route path="/" component={GameContainer} />
      </Switch>
    </div>
  );
};

export default App;
