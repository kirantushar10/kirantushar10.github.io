import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * Cinematic — one scroll clock drives every motion effect on the page:
 *   - the top scroll-progress bar
 *   - the soft gold glow that trails the viewport vertically
 *   - every [data-parallax] element (its data-depth sets the parallax speed)
 *
 * Parallax is computed from each element's distance to the viewport center,
 * so layers drift at their own speed as you scroll — the "parallel" depth
 * effect. One rAF-throttled scrollStore callback, one write per frame.
 *
 * Reduced motion: everything snaps to its resting position, no parallax.
 */
export default function Cinematic() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Collect parallax layers once (they are static for the life of the page)
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]')
    ).map((el) => {
      const depth = parseFloat(el.dataset.parallax || '0') || 0;
      return { el, depth, top: 0, height: 0 };
    });

    const measure = () => {
      const y = window.scrollY;
      for (const l of layers) {
        const rect = l.el.getBoundingClientRect();
        l.top = rect.top + y; // absolute page offset
        l.height = rect.height;
      }
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    const apply = (scrollY: number) => {
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);

      if (barRef.current) {
        const p = Math.min(1, Math.max(0, scrollY / max));
        barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }

      if (glowRef.current) {
        const p = scrollY / max;
        const y = p * (document.documentElement.scrollHeight - vh);
        glowRef.current.style.transform = `translate3d(-50%, ${y - vh * 0.2}px, 0)`;
      }

      if (reducedMotion) return;

      const center = scrollY + vh / 2;
      for (const l of layers) {
        if (!l.depth) continue;
        const elCenter = l.top + l.height / 2;
        const offset = center - elCenter; // px from viewport center
        const ty = offset * l.depth * -0.1; // drift opposite to scroll, scaled
        l.el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
      }
    };

    const unsub = subscribe((y: number) => apply(y));
    apply(window.scrollY || 0);

    return () => {
      unsub();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        className="scroll-progress"
        aria-hidden="true"
      />
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '50%',
          top: '20vh',
          width: 900,
          height: 900,
          transform: 'translate3d(-50%, 0, 0)',
          background:
            'radial-gradient(circle, rgba(217,198,164,0.07), transparent 62%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
