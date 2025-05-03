// @ts-check

import { ReactNode, useRef } from "react";

/**
 * This isn't actually used anywhere right now, but could be used to prevent accidental deletion.
 */
export default function HoldToConfirmButton({ actionToConfirm, timeToConfirm=750, children }: {
    actionToConfirm: Function;
    timeToConfirm?: number;
    children?: ReactNode;
  }) {
  const timeoutRef = useRef(null);

  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
      actionToConfirm();
    }, timeToConfirm)
  };

  const cancelHold = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  return(
    <button
      onMouseDown={ handleMouseDown }
      onMouseUp={ cancelHold }
      onMouseLeave={ cancelHold }
      onTouchStart={ handleMouseDown }
      onTouchEnd={ cancelHold }
    >
      { children }
    </button>
  )
}