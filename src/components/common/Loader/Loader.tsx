import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../../state/gameState';
import { MAX_LOADING_TIME } from '../../../utils/constants';

const Loader = (): React.ReactElement => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const timeoutId = useRef<number>(0);

  // Set loading to 'failed' if it takes too long
  useEffect(() => {
    if (loading === 'loading') {
      clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        setLoading('failed');
      }, MAX_LOADING_TIME);
    } else if (loading === 'ok') {
      clearTimeout(timeoutId.current);
    }
  }, [loading, setLoading]);

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
