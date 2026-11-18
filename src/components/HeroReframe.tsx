import { useEffect } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * HeroReframe — the signature moment.
 *
 * As the hero scrolls out of view, one progress value t (derived from
 * the hero's real geometry) drives the backdrop zoom and the character's
 * drift up and left. Reversible on reverse scroll. Reduced motion and
 * no-JS leave the static t=0 frame.
 */
export default function HeroReframe() {
  useEffect(() => {
    const reducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const section = document.getElementById('hero') as HTMLElement | null;
    const backdrop = document.querySelector<HTMLElement>('[data-hero-backdrop]');
    const character = document.querySelector<HTMLElement>('[data-hero-character]');
    if (!section || !backdrop || !character) return;

    let heroTop = 0;
    let heroH = 1;

    const measure = () => {
      const y = window.scrollY;
      const r = section.getBoundingClientRect();
      heroTop = r.top + y;
      heroH = Math.max(1, r.height);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    const apply = (scrollY: number) => {
      // t: 0 = hero fully in view, 1 = hero fully scrolled past
      const t = Math.min(1, Math.max(0, (scrollY - heroTop) / heroH));

      // Backdrop zooms as the data "loads in"
      const scale = 1 + t * 0.18;
      backdrop.style.transform = `scale(${scale.toFixed(3)})`;
      backdrop.style.transformOrigin = 'center top';

      // Character drifts up and left out of the hero
      const tx = -t * 12;
      const ty = -t * 16;
      character.style.transform = `translate(${tx.toFixed(2)}vw, ${ty.toFixed(2)}vh)`;
    };

    const unsub = subscribe((y: number) => apply(y));
    apply(window.scrollY || 0);

    return () => {
      unsub();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return null;
}