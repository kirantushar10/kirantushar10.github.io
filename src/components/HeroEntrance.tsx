import { motion } from 'framer-motion';

/*
 * Shared Framer Motion variants for the hero entrance sequence.
 * Kept in its own file so HeroContent can import `item` without
 * pulling in the whole component.
 */
export const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroEntrance({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="contents">
      {children}
    </motion.div>
  );
}