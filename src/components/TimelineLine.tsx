import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * Timeline spine — a gold hairline that draws itself top-to-bottom (scaleY
 * 0 -> 1) as the experience section scrolls through the viewport, on the
 * shared scrollStore clock. Reduced motion: drawn fully, no animation.
 */
export default function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      el.style.transform = 'scaleY(1)';
      return;
    }

    const draw = () => {
      // Measure against the section, not the Astro island wrapper —
      // the wrapper has zero height, so parent.getBoundingClientRect()
      // would always report top:0 and break the draw math.
      const section = el.closest<HTMLElement>('#experience');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Draw over the full section: t=0 when the section top reaches the
      // viewport bottom, t=1 when the section bottom reaches the top.
      const travel = rect.height + vh;
      const passed = vh - rect.top;
      const t = Math.max(0, Math.min(1, passed / travel));
      el.style.transform = 'scaleY(' + t.toFixed(4) + ')';
    };

    draw();
    const unsub = subscribe(draw);
    window.addEventListener('resize', draw, { passive: true });
    return () => {
      unsub();
      window.removeEventListener('resize', draw);
    };
  }, []);

  return <div ref={ref} className="timeline-line" aria-hidden="true" />;
}