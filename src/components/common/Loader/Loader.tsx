import React from 'react';
import { useRecoilValue } from 'recoil';
import { isLoadingState } from '../../../state';

const Loader = (): React.ReactElement => {
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <>
      {console.log(isLoading)}
      {isLoading && (
        <div className="loader-container">
          <div className="loader">
            <h2>Loading</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
