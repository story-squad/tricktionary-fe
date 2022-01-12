import React from 'react';
import { Expander } from '..';
import {
  PlayerStepOne,
  PlayerStepThree,
  PlayerStepTwo,
} from '../../common/Instructions';

const HowToPlay = (props: HowToProps): React.ReactElement => {
  const { isExpanded } = props;

  const expandedDefault = isExpanded !== undefined ? isExpanded : false;

  return (
    <Expander
      headerText={'How to Play'}
      closeText={'Close'}
      expandedDefault={expandedDefault}
    >
      <section className="text-content">
        <h3>Step 1: Setup</h3>
        <PlayerStepOne />
        <h3>Step 2: Voting</h3>
        <PlayerStepTwo />
        <h3>Step 3: Results</h3>
        <PlayerStepThree />
      </section>
    </Expander>
  );
};

export default HowToPlay;

interface HowToProps {
  isExpanded?: boolean;
}
