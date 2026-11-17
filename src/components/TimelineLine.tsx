import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

// The experience timeline spine. Draws itself top-to-bottom (scaleY 0 -> 1) as
// the section scrolls through the viewport, on the shared scrollStore clock.
export default function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return subscribe(() => {
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.78; // begin drawing as the top reaches ~78% down the viewport
      const end = vh * 0.5; // finish when the bottom passes the middle
      const travel = rect.height + (start - end);
      const passed = start - rect.top;
      const t = Math.max(0, Math.min(1, passed / travel));
      el.style.transform = 'scaleY(' + t.toFixed(4) + ')';
    });
  }, []);

  return <div ref={ref} className="timeline-line" aria-hidden="true" />;
}