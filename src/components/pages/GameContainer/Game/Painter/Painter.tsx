import React from 'react';
// import { useRecoilValue } from 'recoil';
// import { lobbyState } from '../../../../../state';
import Canvas, { CanvasProps } from './Canvas';

const Painter = (props: CanvasProps): React.ReactElement => {
  // const lobbyData = useRecoilValue(lobbyState);

  return (
    <div className="canvas-paint game-page">
      <Canvas
        {...Canvas.defaultProps}
        remotePaint={props.remotePaint}
        canvasHistory={props.canvasHistory || []}
        refreshEvery={props.refreshEvery}
        width={props.width}
        height={props.height}
      />
      <br />
      <p className="feedback">
        {`We're still in beta-testing and we'd love to hear any ideas you have!`}{' '}
        <a
          target="_blank"
          href="https://forms.gle/Nj3kMpKQpWZU9gxq7"
          rel="noreferrer"
        >
          {' '}
          <h3>Feedback Form</h3>
        </a>
      </p>
    </div>
  );
};

export default Painter;
