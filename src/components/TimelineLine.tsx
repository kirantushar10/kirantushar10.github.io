import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * Timeline spine — a gold hairline that draws itself top-to-bottom (scaleY
 * 0 -> 1) as the experience section scrolls through the viewport, on the
 * shared scrollStore clock. Each experience node is re-centred on the rail
 * at runtime (measured, not hard-coded), so the glowing dot sits exactly on
 * the vertical line on every breakpoint — mobile and desktop — and glows as
 * the spine draws past it. A small gap in the rail at each node ensures the
 * dot appears seated on the line, not floating above it. Reduced motion:
 * drawn fully, nodes lit, no motion.
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
    // `left` can drift between breakpoints. `left` is relative to the node's
    // positioning ancestor, so resolve that ancestor and compute the absolute
    // left that puts the node's centre exactly on the rail centre.
    const centerNodes = () => {
      if (!rail) return;
      const rc = rail.getBoundingClientRect();
      const railCenter = rc.left + rc.width / 2;
      nodes.forEach((n) => {
        const nr = n.getBoundingClientRect();
        const anchor = n.offsetParent;
        const ar = anchor ? anchor.getBoundingClientRect() : { left: 0 };
        n.style.left = railCenter - nr.width / 2 - ar.left + 'px';
        n.style.marginLeft = '0px';
      });
    };

    // Add small gap elements under the rail at each node's vertical position
    // so the dot appears seated on the line rather than floating above it.
    const addRailGaps = () => {
      if (!rail) return;
      // Remove existing gaps first
      const existingGaps = rail.querySelectorAll('.tl-rail-gap');
      existingGaps.forEach(g => g.remove());

      // Add a gap element at each node's position. The gap is a thin transparent
      // rect that sits on top of the rail, creating a break where the dot glows.
      nodes.forEach((n, i) => {
        const gap = document.createElement('div');
        gap.className = 'tl-rail-gap';
        gap.style.position = 'absolute';
        gap.style.left = '0';
        gap.style.top = '6px'; // start of rail
        gap.style.bottom = '6px'; // end of rail
        gap.style.width = '12px'; // slightly wider than the 9px dot
        gap.style.pointerEvents = 'none';
        gap.style.zIndex = '10';
        // Estimate vertical position: nodes are roughly evenly distributed
        // through the experience section. We use the node's top position relative
        // to the section to determine the gap's height offset.
        const nr = n.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const nodeTopPercent = (nr.top - sectionRect.top) / sectionRect.height;
        // Map to rail height (section height minus 12px top/bottom padding)
        const railHeight = sectionRect.height - 12;
        const gapTop = nodeTopPercent * railHeight;
        gap.style.top = `calc(${gapTop}px)`; // Adjusted
        gap.style.height = '12px'; // Match CSS
        gap.style.background = 'var(--color-bg)'; // Match page background
        rail.appendChild(gap);
      });
    };

    const draw = () => {
      // Re-centre on every tick: each item wrapper carries a
      // translateX reveal that moves while the item scrolls into view, and
      // the node lives inside that wrapper. Computing `left` from the
      // wrapper's *current* rect keeps the node pinned to the rail through
      // the whole reveal — measuring once at mount lets the reveal jump it.
      centerNodes();

      // Update rail gap positions on every tick so they stay aligned
      // with nodes even as scroll-reveal transforms shift them.
      addRailGaps();

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
    window.addEventListener('resize', () => { centerNodes(); draw(); addRailGaps(); }, { passive: true });
    return () => {
      unsub();
      window.removeEventListener('resize', centerNodes);
    };
  }, []);

  return <div ref={ref} className="timeline-line" aria-hidden="true" />;
}