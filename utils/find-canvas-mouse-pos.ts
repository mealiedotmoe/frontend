import { MouseEvent as ReactMouseEvent } from 'react';

export function findCanvasMousePos(event: MouseEvent|ReactMouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement): { x: number; y: number; } {
  const boundingRect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - boundingRect.left - canvas.clientLeft,
    y: event.clientY - boundingRect.top - canvas.clientTop
  };
}