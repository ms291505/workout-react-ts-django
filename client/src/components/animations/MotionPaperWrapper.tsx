// MotionPaperWrapper.tsx
import { Paper, PaperProps } from "@mui/material";
import { motion, useAnimationControls, Variants } from "framer-motion";
import { useEffect, forwardRef } from "react";

export interface MotionPaperWrapperProps extends PaperProps {
  triggerShake?: boolean;
  variants: Variants;
}

const MotionPaperWrapper = forwardRef<HTMLDivElement, MotionPaperWrapperProps>(
  ({ triggerShake, variants, ...props }, ref) => {
    const controls = useAnimationControls();

    useEffect(() => {
      if (triggerShake) {
        controls.start("shake").then(() => controls.start("initial"));
      }
    }, [triggerShake]);

    return (
      <Paper
        component={motion.div}
        ref={ref}
        animate={controls}
        initial="initial"
        variants={variants}
        {...props}
      />
    );
  }
);

export default MotionPaperWrapper;
