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
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.78;
      const end = vh * 0.5;
      const travel = rect.height + (start - end);
      const passed = start - rect.top;
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