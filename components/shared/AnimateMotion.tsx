"use client";

import { motion, MotionProps } from "framer-motion";
import { HTMLAttributes, ReactNode } from "react";

interface AnimateMotionProps extends Omit<MotionProps, "children"> {
  children: ReactNode;
  className?: string;
  as?: keyof typeof motion; // Allow different HTML elements (div, section, span, etc.)
}

/**
 * Reusable AnimateMotion Component
 * Wraps framer-motion for client-side animations
 *
 * @example
 * <AnimateMotion
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={{ opacity: 1, y: 0 }}
 *   transition={{ duration: 0.6 }}
 *   whileHover={{ scale: 1.05 }}
 *   className="your-classes"
 * >
 *   <YourContent />
 * </AnimateMotion>
 */
const AnimateMotion = ({
  children,
  className,
  as = "div",
  ...motionProps
}: AnimateMotionProps) => {
  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent className={className} {...motionProps}>
      {children}
    </MotionComponent>
  );
};

export default AnimateMotion;
