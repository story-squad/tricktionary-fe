import React from 'react';
import { HOCProps } from '../../../types/commonTypes';

const View = (
  props: HOCProps & { show: boolean },
): React.ReactElement | null => {
  return props.show ? <>{props.children}</> : null;
};

export default View;
