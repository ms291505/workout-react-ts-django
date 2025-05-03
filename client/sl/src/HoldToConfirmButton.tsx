// @ts-check

import React, { useRef } from "react";

/**
 * 
 * @param {{
 *  actionToConfirm: function,
 *  timeToConfirm?: number,
 *  children?: any}} props
 */
export default function HoldToConfirmButton({ actionToConfirm, timeToConfirm=750, children }) {
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