import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../../state';

// time until Loader closes in milliseconds
const maxLoadingTime = 8000;

const Loader = (): React.ReactElement => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [timeoutId, setTimeoutId] = useState<number>(0);

  // Set loading to 'failed' if it takes too long
  useEffect(() => {
    if (loading === 'loading') {
      clearTimeout(timeoutId);
      setTimeoutId(
        window.setTimeout(() => {
          setLoading('failed');
        }, maxLoadingTime),
      );
    } else if (loading === 'ok') {
      clearTimeout(timeoutId);
    }
  }, [loading]);

  return (
    <>
      {loading === 'loading' && (
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
