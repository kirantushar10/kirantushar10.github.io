import { motion } from 'framer-motion';

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17l10-10"/>
    <path d="M7 7h10v10"/>
  </svg>
);

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  index: number;
  githubUrl?: string;
  demoUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  tags,
  featured = false,
  index,
  githubUrl,
  demoUrl,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="project-row group relative"
    >
      <div className="grid items-center gap-6 px-1 py-7 md:px-2 md:py-8 md:grid-cols-[2.6rem_1fr_auto]">
        {/* Big mono index numeral */}
        <span
          className={`font-mono text-xs md:text-sm tabular-nums pt-1 transition-colors duration-300 group-hover:text-amber ${
            featured ? 'text-amber' : 'text-muted/60'
          }`}
        >
          0{index + 1}
        </span>

        {/* Title + description + chips */}
        <div className="min-w-0 pr-4">
          <h3 className="font-display font-semibold text-lg sm:text-xl md:text-2xl tracking-tight text-ink group-hover:text-amber transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {tags.map((tag) => (
              <span key={tag} className="font-mono text-[11px] text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: GitHub icon + arrow */}
        <div className="flex items-center gap-3 justify-end">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${title} on GitHub`}
              className="w-9 h-9 border border-rule flex items-center justify-center text-muted hover:text-amber hover:border-amber-dim transition-colors duration-200"
            >
              <GithubIcon />
            </a>
          )}
          <span className="project-arrow flex items-center justify-center w-9 h-9 border border-rule text-amber">
            <ArrowUpRightIcon />
          </span>
        </div>
      </div>
    </motion.div>
  );
}