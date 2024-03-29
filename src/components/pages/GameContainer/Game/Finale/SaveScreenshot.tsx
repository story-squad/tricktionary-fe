import { toJpeg } from 'html-to-image';
import React, { RefObject, useCallback, useState } from 'react';

const SaveScreenshot = (props: ScreenshotProps): React.ReactElement => {
  const { podiumRef } = props;
  const ref = podiumRef;

  const [disableBtn, setDisableBtn] = useState(false);

  const saveScreenshot = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    setDisableBtn(true);

    toJpeg(ref.current, {
      cacheBust: true,
      quality: 0.7,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'wordhoax-winners.jpg';
        link.href = dataUrl;
        link.click();

        setDisableBtn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  return (
    <div className="save-screenshot">
      <button onClick={saveScreenshot} disabled={disableBtn}>
        Save screenshot
      </button>
    </div>
  );
};

export default SaveScreenshot;

interface ScreenshotProps {
  podiumRef: RefObject<HTMLDivElement>;
}
