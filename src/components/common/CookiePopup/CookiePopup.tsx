import React, { useEffect, useState } from 'react';
import { cookie } from '../../../utils';

const CookiePopup = (): React.ReactElement => {
  const [isShowing, setIsShowing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const hideCookie = cookie.get();
    setIsChecked(hideCookie);
    setIsShowing(!hideCookie);
  }, []);

  const toggleCheck = () =>
    setIsChecked((c) => {
      c ? cookie.clear() : cookie.set();
      return !c;
    });
  const closePopup = () => setIsShowing(false);

  return isShowing ? (
    <div className="cookie-popup">
      <div className="popup-content">
        <h3>Cookie Policy</h3>
        <p>
          This website stores data such as cookies to enable necessary site
          functionality and analytics. By remaining on this website you indicate
          your consent.
        </p>
        <div className="popup-bottom">
          <label>
            <input type="checkbox" checked={isChecked} onChange={toggleCheck} />{' '}
            Don&apos;t show again
          </label>
          <button onClick={closePopup}>Okay</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookiePopup;
