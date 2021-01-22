import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { GameContainer } from './components/pages/GameContainer';

const App = (): React.ReactElement => {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={GameContainer} />
      </Switch>
    </div>
  );
};

export default App;
