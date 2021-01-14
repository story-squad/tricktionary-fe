import React from 'react';
// import { Link } from 'react-router-dom';
// import { ClimbingBoxLoader } from 'react-spinners';
// import { useRecoilState } from 'recoil';
// import { apiError } from '../../../state';
// import { Header } from '../Header';

const Loader = (): React.ReactElement => {
  //   const [dots, setDots] = useState('');
  //   const [loadingError, setLoadingError] = useRecoilState(apiError.global);

  //   useEffect(() => {
  //     const dotTimer = setInterval(() => {
  //       setDots((cur) => {
  //         if (cur.length >= 3) return '';
  //         else return cur + '.';
  //       });
  //     }, 500);
  //     return () => {
  //       clearInterval(dotTimer);
  //       setLoadingError(null);
  //     };
  //   }, []);

  return (
    <div className="loader">
      <h2>Loader Temp</h2>
      {/* <Header />
      <div className="loader-body">
        {loadingError ? (
          <>
            <div className="message error">{loadingError}</div>
            <Link to="/">Back to Home</Link>
          </>
        ) : (
          <>
            <ClimbingBoxLoader loading={true} />
            <div className="message">
              {message}
              {dots}
            </div>
          </>
        )}
      </div> */}
    </div>
  );
};

export default Loader;
