import { motion } from "framer-motion";
import React from "react";

type AnimatedButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  ...props
}) => (
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;
