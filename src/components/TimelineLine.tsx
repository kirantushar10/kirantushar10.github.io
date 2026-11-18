import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * Timeline spine — a gold hairline that draws itself top-to-bottom (scaleY
 * 0 -> 1) as the experience section scrolls through the viewport, on the
 * shared scrollStore clock. Each experience node is re-centred on the rail
 * at runtime (measured, not hard-coded), so the glowing dot sits exactly on
 * the vertical line on every breakpoint — mobile and desktop — and glows as
 * the spine draws past it. Reduced motion: drawn fully, nodes lit, no motion.
 */
export default function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const section = el.closest<HTMLElement>('#experience');
    if (!section) return;
    const rail = section.querySelector<HTMLElement>('.tl-rail');
    const nodes = Array.from(section.querySelectorAll<HTMLElement>('.tl-node'));

    // Centre every node on the rail by measurement. The rail and the nodes
    // sit in different stacking contexts (the rail is a child of the padded
    // wrapper, the nodes are children of the flat item wrappers), so a fixed
    // `left` can drift between breakpoints. Measuring the rail and setting
    // each node's left from that keeps the dot on the line everywhere.
    const centerNodes = () => {
      if (!rail) return;
      const rc = rail.getBoundingClientRect();
      const railCenter = rc.left + rc.width / 2;
      nodes.forEach((n) => {
        const nr = n.getBoundingClientRect();
        n.style.left = railCenter - nr.left - nr.width / 2 + 'px';
      });
    };

    const draw = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Draw over the full section: t=0 when the section top reaches the
      // viewport bottom, t=1 when the section bottom reaches the top.
      const travel = rect.height + vh;
      const passed = vh - rect.top;
      const t = Math.max(0, Math.min(1, passed / travel));

      if (reducedMotion) {
        el.style.transform = 'scaleY(1)';
      } else {
        el.style.transform = 'scaleY(' + t.toFixed(4) + ')';
      }

      // Glow each node as the spine draws down past it. The spine is pinned
      // to the top of the section and grows downward, so a node lights up
      // when the drawn bottom reaches its vertical position.
      const spineBottom = rect.top + 6 + (rect.height - 12) * t;
      nodes.forEach((n) => {
        const nr = n.getBoundingClientRect();
        n.classList.toggle('visible', nr.top <= spineBottom + vh * 0.05);
      });
    };

    centerNodes();
    draw();
    const unsub = subscribe(draw);
    window.addEventListener('resize', () => { centerNodes(); draw(); }, { passive: true });
    return () => {
      unsub();
      window.removeEventListener('resize', centerNodes);
    };
  }, []);

  return <div ref={ref} className="timeline-line" aria-hidden="true" />;
}