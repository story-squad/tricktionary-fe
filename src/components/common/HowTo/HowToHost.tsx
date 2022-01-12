//** Import Modules */
import React from 'react';
import { Expander } from '..';
import {
  HostStepOne,
  HostStepThree,
  HostStepTwo,
} from '../../common/Instructions';

const HowToHost = (props: HowToProps): React.ReactElement => {
  const { isExpanded } = props;

  const expandedDefault = isExpanded !== undefined ? isExpanded : false;

  return (
    <Expander
      headerText={'How to Host a Game'}
      closeText={'Close'}
      expandedDefault={expandedDefault}
    >
      <section className="text-content">
        <h3>Step 1: Setup</h3>
        <HostStepOne />
        <h3>Step 2: Voting</h3>
        <HostStepTwo />
        <h3>Step 3: Results</h3>
        <HostStepThree />
        <div className="visual-line-break" />
      </section>
    </Expander>
  );
};

export default HowToHost;

interface HowToProps {
  isExpanded?: boolean;
}
