import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function InteractiveHeadline() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight text-white">
      Solving{' '}
      <span 
        className="inline-block relative cursor-pointer w-full content-center align-top"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isHovered ? (
            <motion.span
              key="puzzles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-0 w-full text-center lg:text-left text-pink-500"
            >
              Puzzles
            </motion.span>
          ) : (
            <motion.span
              key="problems"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-0 w-full text-center lg:text-left"
            >
              Problems
            </motion.span>
          )}
        </AnimatePresence>
        {/* Invisible spacer to maintain width */}
        <span className="invisible">Problems</span>
      </span>
      <br /> with <span className="text-pink-500">Software</span>
    </h1>
  );
}
