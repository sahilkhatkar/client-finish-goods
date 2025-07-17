'use client';
import { motion } from 'framer-motion';

export default function AnimatedWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}

      style={{
        display: 'contents', // Use contents to avoid extra div wrapping
      }}
    >
      {children}
    </motion.div>
  );
}
