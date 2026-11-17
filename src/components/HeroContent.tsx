import { motion } from 'framer-motion';
import { container, item } from './HeroEntrance';

/*
 * Hero copy, rendered as a React component so Framer Motion can
 * sequence it on load. Kept verbatim from the original Astro markup.
 */
export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-5xl mx-auto px-6 py-28"
    >
      <motion.p
        variants={item}
        className="font-mono text-xs tracking-[0.22em] text-gold uppercase mb-6"
      >
        AI/ML Engineer · Munich, Germany
      </motion.p>

      <motion.h1
        variants={item}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.03em] leading-[0.98]"
      >
        <span className="mask-line">
          <span className="reveal-inner">Building</span>
        </span>
        <span className="mask-line" style={{ '--rd': '120ms' } as React.CSSProperties}>
          <span className="reveal-inner">AI Agents <span className="text-gold">&amp;</span> RAG</span>
        </span>
        <span className="mask-line" style={{ '--rd': '240ms' } as React.CSSProperties}>
          <span className="reveal-inner">Pipelines</span>
        </span>
      </motion.h1>

      <motion.div variants={item} className="mt-10 grid gap-10 md:grid-cols-12 items-end">
        <div className="md:col-span-7">
          <p className="text-base sm:text-lg leading-relaxed text-mid max-w-xl">
            I architect production LLM applications, retrieval-augmented generation
            systems, and agentic workflows for enterprise engineering platforms.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#work"
              className="px-6 py-3 bg-gold text-bg text-sm font-medium rounded-lg hover:brightness-110 transition"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 border border-rule text-mid text-sm rounded-lg hover:text-ink hover:border-gold/50 transition"
            >
              Get in Touch
            </a>
          </div>
        </div>
        <div className="md:col-span-5 flex md:justify-end" data-parallax="0.08">
          <p className="font-mono text-xs sm:text-sm text-dim">
            [ AI/ML Specialist · Munich, DE ]
            <span className="caret" aria-hidden="true"></span>
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="mt-14 flex items-center gap-3 scroll-cue"
        aria-hidden="true"
      >
        <span className="w-px h-8 bg-gold/40"></span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
          Scroll
        </span>
      </motion.div>
    </motion.div>
  );
}