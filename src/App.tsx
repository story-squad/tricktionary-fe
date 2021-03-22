import React, { useEffect } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Route, Switch } from 'react-router-dom';
import { CookiePopup } from './components/common/CookiePopup';
import { Footer } from './components/common/Footer';
import { GameContainer } from './components/pages/GameContainer';
import { useLocalStorage } from './hooks';

const App = (): React.ReactElement => {
  const [openTabs, setOpenTabs] = useLocalStorage('openTabs', 0);

  // Keep track of the number of tabs players are using
  useEffect(() => {
    if (Number(openTabs) >= 0) {
      setOpenTabs(Number(openTabs) + 1);
    } else {
      setOpenTabs(1);
    }
  }, []);

  useBeforeunload(() => {
    setOpenTabs(Number(openTabs) - 1);
  });

  return (
    <div className="App">
      <CookiePopup />
      <Switch>
        <Route path="/" component={GameContainer} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
