"use client";
import { motion } from "framer-motion";

const mainVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  enter: { scale: 1, opacity: 1 },
  exit: { scale: 0.7, opacity: 0 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      variants={mainVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "tween", stiffness: 100 }}
    >
      {children}
    </motion.main>
  );
}
