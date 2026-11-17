import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * HeroReframe — the signature moment.
 *
 * As the hero scrolls out of view, one progress value t (derived from
 * the hero's real geometry) maps three states:
 *   t=0  hero full — backdrop at rest, character at bottom-right
 *   t=1  hero gone — backdrop zoomed, three gold rules drawn across
 *        the right side of the viewport labeled with the RAG pipeline
 *        stages the hero copy names: RETRIEVAL -> AUGMENTATION ->
 *        GENERATION, and the character has drifted up and left through
 *        them.
 *   t>1  the rules dissolve so the rest of the page stays clean.
 *
 * Reversible on reverse scroll. Text column holds. Reduced motion and
 * no-JS leave the static t=0 frame.
 */
export default function HeroReframe() {
  const rulesRef = useRef<(HTMLSpanElement | null)[]>([]);

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

    const ruleEls = rulesRef.current;

    const apply = (scrollY: number) => {
      // t: 0 = hero fully in view, 1 = hero fully scrolled past
      const t = Math.min(1.25, Math.max(0, (scrollY - heroTop) / heroH));

      // Backdrop zooms as the data "loads in"
      const scale = 1 + t * 0.18;
      backdrop.style.transform = `scale(${scale.toFixed(3)})`;
      backdrop.style.transformOrigin = 'center top';

      // Character drifts up and left through the pipeline bands
      const tx = -t * 12;
      const ty = -t * 16;
      character.style.transform = `translate(${tx.toFixed(2)}vw, ${ty.toFixed(2)}vh)`;

      // Three rules draw right->left, then dissolve after t>1
      const dissolve = t >= 1 ? (1.25 - t) / 0.25 : 1; // 1 at t<=1, 0 at t>=1.25
      for (let i = 0; i < 3; i++) {
        const el = ruleEls[i];
        if (!el) continue;
        const seg = 1 / 3;
        const local = Math.min(1, Math.max(0, (t - i * seg) / seg));
        el.style.width = (local * 40).toFixed(2) + '%';
        el.style.opacity = (local * dissolve).toFixed(3);
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
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: '22vh 0',
      }}
    >
      {['RETRIEVAL', 'AUGMENTATION', 'GENERATION'].map((label, i) => (
        <span
          key={label}
          ref={(el) => (rulesRef.current[i] = el)}
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '0%',
            opacity: 0,
            marginLeft: 'auto',
            transition: 'width 0.18s linear, opacity 0.2s linear',
          }}
        >
          <span
            style={{
              width: '40%',
              height: '1px',
              background:
                i === 1
                  ? 'linear-gradient(90deg, transparent, var(--color-gold) 30%, var(--color-gold) 70%, transparent)'
                  : 'linear-gradient(90deg, transparent, var(--color-rule))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.24em',
              color: i === 1 ? 'var(--color-gold)' : 'var(--color-dim)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              padding: '0 14px 0 10px',
            }}
          >
            0{i + 1} — {label}
          </span>
        </span>
      ))}
    </div>
  );
}