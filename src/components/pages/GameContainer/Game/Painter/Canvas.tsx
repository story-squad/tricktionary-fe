import React, { useCallback, useEffect, useRef, useState } from 'react';

export type Coordinate = {
  x: number;
  y: number;
};

export interface CanvasProps {
  width: number;
  height: number;
  refreshEvery: number | undefined;
  remotePaint: (oldVector: Coordinate, newVector: Coordinate) => void;
  canvasHistory: number[][];
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Canvas = ({
  width,
  height,
  remotePaint,
  canvasHistory,
  refreshEvery,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>();
  const [historyCount, setHistoryCount] = useState(0);
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const x: number = event.pageX - canvas.offsetLeft;
    const y: number = event.pageY - canvas.offsetTop;
    return { x, y };
  };
  const startPaint = useCallback((event: MouseEvent) => {
    autoPaint(canvasHistory);
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);
  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate,
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = '#162ca7';
      context.lineJoin = 'round';
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();
      context.stroke();
    }
  };

  const autoPaint = (instructions: number[][]) => {
    if (!instructions) {
      return;
    }
    if (historyCount >= instructions.length) {
      return;
    }
    setHistoryCount(instructions.length);

    instructions.forEach((vector) => {
      const [x1, y1, x2, y2] = vector;
      if (!canvasRef.current) {
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = '#162ca7';
        context.lineJoin = 'round';
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();
        context.stroke();
      }
    });
  };
  const paint = useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          if (remotePaint) {
            remotePaint(mousePosition, newMousePosition);
          }
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition],
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      if (historyCount < canvasHistory.length) {
        autoPaint(canvasHistory);
      }
    }, refreshEvery);
    return () => clearInterval(interval);
  }, []);
  // mousedown
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);
  // mousemove
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  // mouseup/mouseleave
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  useEffect(() => {
    if (canvasHistory && canvasHistory.length > historyCount) {
      autoPaint(canvasHistory);
    }
  }, [canvasHistory]);

  return (
    <canvas
      style={{ border: '1px solid red' }}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};
Canvas.defaultProps = {
  width: 640,
  height: 480,
  refreshEvery: 5000,
  canvasHistory: [],
};

export default Canvas;
