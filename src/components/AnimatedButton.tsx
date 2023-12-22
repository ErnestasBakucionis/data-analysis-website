import { motion } from "framer-motion";
import React from "react";

type AnimatedButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = "px-3 py-2 rounded-md text-sm font-medium text-gray-100 hover:bg-green-600 bg-green-500",
  ...props
}) => (
  <motion.button
    className={className}
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;
