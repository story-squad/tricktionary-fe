import React from 'react';
import { useRecoilValue } from 'recoil';
import { isLoadingState } from '../../../state';

const Loader = (): React.ReactElement => {
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <>
      {console.log(isLoading)}
      {isLoading && (
        <div className="loader">
          <h2>Loader Temp</h2>
        </div>
      )}
    </>
  );
};

export default Loader;
