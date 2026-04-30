import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const domains = ['Web', 'Mobile', 'Desktop', 'Games'];

export default function InteractiveHeadline() {
  const [activeDomain, setActiveDomain] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveDomain((prev) => (prev + 1) % domains.length);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
        Solving Puzzles
        <br />
        with <span className="text-pink-400">Software</span>
      </h1>

      <p className="mt-4 text-sm sm:text-base text-slate-400 font-code uppercase tracking-[0.18em]">
        Across{' '}
        <span className="inline-block relative min-w-[7ch] text-left align-top">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={domains[activeDomain]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute left-0 top-0 text-pink-300"
            >
              {domains[activeDomain]}
            </motion.span>
          </AnimatePresence>
          <span className="invisible">Desktop</span>
        </span>
      </p>
    </div>
  );
}
