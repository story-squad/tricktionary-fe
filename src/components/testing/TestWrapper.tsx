import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { HOCProps } from '../../types/commonTypes';

const TestWrapper = (props: HOCProps): React.ReactElement => {
  return (
    <React.StrictMode>
      <HelmetProvider>
        <RecoilRoot>
          <Router>{props.children}</Router>
        </RecoilRoot>
      </HelmetProvider>
    </React.StrictMode>
  );
};

export default TestWrapper;
