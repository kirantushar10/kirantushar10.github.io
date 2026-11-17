import { useEffect, useRef, useCallback } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * HeroParallax — scroll-driven depth stage for the hero section.
 *
 * Wraps the hero content in a `position: sticky; top: 0; height: 100vh` stage
 * pinned inside a ~140vh section. Three depth layers (background art, headline,
 * content) each move at their own parallax factor while the stage is pinned.
 *
 * - subscribes to scrollStore (positional args: y, progress, direction)
 * - computes hero-local progress from stage's pin range (sectionH - viewportH)
 * - pointermove tilt on fine-pointer devices only
 * - single rAF loop lerps current → target; writes transform styles imperatively
 * - headline mask-line reveal is TIME-driven on mount (staggered entrance), then
 *   scroll-driven drift/separation during pin
 * - HUD telemetry readout (mono, amber-dim, aria-hidden) shows hero-local progress
 * - prefers-reduced-motion: static render, no transforms, headline visible
 * - no-JS: hero fully readable at default position
 */

const LINE_ENTRANCE_DELAYS = [0.1, 0.22, 0.34]; // seconds
const LINE_ENTRANCE_DURATION = 1.0; // seconds
const EASE_OUT_QUINT = (t: number) => 1 - Math.pow(1 - t, 5);
const SMOOTHSTEP = (t: number) => t * t * (3 - 2 * t);

export default function HeroParallax() {
  const stageRef = useRef<HTMLDivElement>(null);
  const bgArtRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const maskInnersRef = useRef<HTMLSpanElement[]>([]);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Find the hero section (parent of the sticky stage) for pin-range measurement
    const heroSection = stage.closest('section');
    if (!(heroSection instanceof HTMLElement)) return;
    heroSectionRef.current = heroSection;

    // Collect .reveal-inner elements for headline mask reveals
    const headline = headlineRef.current;
    const maskInners: HTMLSpanElement[] = [];
    if (headline) {
      maskInners.push(...(headline.querySelectorAll('.hero-mask-inner') as unknown as HTMLSpanElement[]));
    }
    maskInnersRef.current = maskInners;

    const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Pin-range measurement ---
    let pinDistance = 0; // scroll distance during which stage is pinned
    const measurePin = () => {
      const section = heroSectionRef.current;
      if (!section) return;
      const h = section.offsetHeight;
      const vh = window.innerHeight;
      pinDistance = Math.max(1, h - vh); // guard against zero
    };
    measurePin();
    let rafResize: number | null = null;
    const onResize = () => { if (rafResize === null) rafResize = requestAnimationFrame(() => { rafResize = null; measurePin(); }); };
    window.addEventListener('resize', onResize, { passive: true });

    // --- Target state ---
    let targetProgress = 0; // 0..1 across pinDistance
    let targetMouseX = 0;
    let targetMouseY = 0;
    let heroVisible = true;

    // --- Current (lerped) state ---
    let curProgress = 0;
    let curMouseX = 0;
    let curMouseY = 0;

    // --- Entrance timing ---
    const mountTime = performance.now();

    // --- Pointer move ---
    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    if (isFinePointer && !prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // --- IntersectionObserver: track if hero stage is in viewport ---
    const heroObserver = new IntersectionObserver(
      (entries) => { heroVisible = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    heroObserver.observe(stage);

    // --- Scroll subscription (positional args: y, globalProgress, direction) ---
    const unsubScroll = subscribe((y: number, _globalProgress: number, direction: 1 | -1) => {
      targetProgress = pinDistance > 0 ? Math.max(0, Math.min(1, y / pinDistance)) : 0;

      // Update HUD text directly (no lerp for readability)
      if (hudRef.current) {
        const pct = (targetProgress * 100).toFixed(1);
        const depth = Math.round(-targetProgress * 2000);
        const signal = targetProgress < 0.02 ? 'INIT' : 'NOMINAL';
        const dir = direction === 1 ? '↓' : '↑';
        hudRef.current.innerHTML =
          `SCROLL ${pct.padStart(6, ' ')}%\n` +
          `DEPTH  ${depth.toString().padStart(6, ' ')}\n` +
          `SIGNAL ● ${signal}\n` +
          `DIR ${dir}`;
      }
    });

    // --- rAF loop ---
    const LERP = 0.1;

    // Initialize mask-lines to hidden state with no transition
    maskInnersRef.current.forEach((el) => {
      el.classList.add('hero-mask-static');
      el.style.transform = 'translate3d(0, 115%, 0)';
    });

    // Remove static class after first paint so rAF-driven changes are smooth
    requestAnimationFrame(() => {
      maskInnersRef.current.forEach((el) => {
        el.classList.remove('hero-mask-static');
      });
    });

    const loop = () => {
      curProgress += (targetProgress - curProgress) * LERP;
      curMouseX += (targetMouseX - curMouseX) * LERP;
      curMouseY += (targetMouseY - curMouseY) * LERP;

      if (prefersReducedMotion) {
        // Ensure headline is visible
        maskInnersRef.current.forEach((el) => {
          el.style.transform = 'translate3d(0, 0, 0)';
        });
        return;
      }

      if (!heroVisible) return;

      const hp = curProgress; // hero-local progress 0..1

      // --- Layer -1: Higgsfield background art (deepest, slowest parallax) ---
      // Cinematic dolly: scale up, translate up slowly, opacity fade at end, additive blend
      if (bgArtRef.current) {
        const scale = 1.04 + hp * 0.14; // 1.04 → 1.18
        const translateY = -hp * 90; // subtle up drift (parallax)
        const opacity = 1 - SMOOTHSTEP(Math.max(0, (hp - 0.45) / 0.55)) * 0.85; // 1 → 0.15 in last 55%
        bgArtRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        bgArtRef.current.style.opacity = opacity.toFixed(3);
      }

      // --- Layer 0: Background plate (faint "//" glyph) ---
      if (plateRef.current) {
        const translateY = -hp * 160;
        const opacity = Math.max(0, 0.5 - hp * 0.8);
        plateRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
        plateRef.current.style.opacity = opacity.toFixed(3);
      }

      // --- Layer 1: Headline — moves up fast, slight scale, mouse tilt ---
      const hlTranslateY = -hp * 220;
      const hlScale = 1 + hp * 0.03;
      const tiltX = -curMouseY * 1.5;
      const tiltY = curMouseX * 1.5;
      if (headlineRef.current) {
        headlineRef.current.style.transform =
          `translate3d(0, ${hlTranslateY.toFixed(2)}px, 0) ` +
          `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ` +
          `scale(${hlScale.toFixed(4)})`;
      }

      // --- Mask-line headline reveals ---
      // Entrance (time-driven on mount) → then scroll-driven separation
      const now = performance.now();
      const elapsed = (now - mountTime) / 1000; // seconds since mount

      const lines = maskInnersRef.current;
      for (let i = 0; i < lines.length && i < LINE_ENTRANCE_DELAYS.length; i++) {
        const delay = LINE_ENTRANCE_DELAYS[i];
        const local = Math.max(0, Math.min(1, (elapsed - delay) / LINE_ENTRANCE_DURATION));
        const eased = EASE_OUT_QUINT(local);
        const entranceTy = 115 * (1 - eased); // % from 115 → 0

        // After entrance, scroll-driven separation: each line drifts up at increasing rate
        const separation = -hp * (40 + i * 70); // px: line 0 -40, line 1 -110, line 2 -180
        const totalTy = `calc(${entranceTy.toFixed(2)}% + ${separation.toFixed(2)}px)`;

        lines[i].style.transform = `translate3d(0, ${totalTy}, 0)`;
      }

      // --- Layer 2: Content cluster — moves up fastest, fades out ---
      const contentTranslateY = -hp * 280;
      const contentOpacity = Math.max(0.15, 1 - SMOOTHSTEP(Math.max(0, (hp - 0.55) / 0.45)) * 0.95);
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${contentTranslateY.toFixed(2)}px, 0)`;
        contentRef.current.style.opacity = contentOpacity.toFixed(3);
      }

      // --- Scroll cue: fade out early ---
      // (handled by CSS opacity transition on .scroll-cue based on data-reveal, but we can also fade via hp if needed)
    };

    // Use a self-continuing rAF
    let rafId = 0;
    const runLoop = () => {
      loop();
      rafId = requestAnimationFrame(runLoop);
    };
    rafId = requestAnimationFrame(runLoop);

    return () => {
      cancelAnimationFrame(rafId);
      if (rafResize !== null) cancelAnimationFrame(rafResize);
      if (isFinePointer && !prefersReducedMotion) {
        window.removeEventListener('mousemove', onMouseMove);
      }
      window.removeEventListener('resize', onResize);
      heroObserver.disconnect();
      unsubScroll();
    };
  }, []);

  return (
    <>
      <style>{`
        /* Disable CSS transitions on hero mask-lines — driven imperatively by rAF */
        .hero-mask-inner {
          transition: none !important;
        }
        /* Temporary class to prevent flash on mount */
        .hero-mask-static {
          transition: none !important;
        }
        /* HUD monospace readout styling */
        .hud-readout {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
          font-size: 10px;
          line-height: 1.5;
          letter-spacing: 0.15em;
          color: rgba(255, 176, 0, 0.35);
          white-space: pre;
        }
        /* Scroll cue fade during pin (css fallback) */
        @media (prefers-reduced-motion: no-preference) {
          .scroll-cue {
            opacity: 1;
            transition: opacity 0.3s ease-out;
          }
        }
        /* Mobile: reduce parallax amplitudes */
        @media (max-width: 767px) {
          .hero-plate { opacity: 0.25 !important; }
          .hero-bg-art { opacity: 0.12 !important; }
        }
      `}</style>

      <div
        ref={stageRef}
        className="sticky top-0 w-full h-screen min-h-[100svh] flex items-end overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* === Layer -1: Higgsfield background art (deepest, slowest parallax) === */}
        <div
          ref={bgArtRef}
          className="hero-bg-art absolute inset-0 pointer-events-none"
          style={{
            willChange: 'transform, opacity',
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            // Cinematic look: screen blend + radial gradient mask to fade edges
            mixBlendMode: 'screen',
            WebkitMaskImage: 'radial-gradient(ellipse 120% 100% at 50% 40%, black 45%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 120% 100% at 50% 40%, black 45%, transparent 100%)',
            filter: 'saturate(0.55) contrast(1.05) brightness(0.55)',
          }}
          aria-hidden="true"
        />

        {/* === Layer 0: Background plate (faint "//" glyph) === */}
        <div
          ref={plateRef}
          className="hero-plate absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ willChange: 'transform, opacity' }}
        >
          <span
            className="font-display font-bold text-[clamp(10rem,30vw,28rem)] leading-none hidden md:block"
            style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,176,0,0.08)' }}
            aria-hidden="true"
          >
            //
          </span>
        </div>

        {/* === Content wrapper (z-indexed above plate) === */}
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-14" style={{ zIndex: 10 }}>

          {/* Kicker */}
          <p className="kicker mb-6" data-reveal style={{ '--rd': '0ms' } as any}>
            01 — Tushar Kiran · AI/ML Engineer · Munich
          </p>

          {/* === Layer 1: Oversized headline === */}
          <h1
            ref={headlineRef}
            className="font-display font-bold tracking-[-0.03em] leading-[0.98] text-[clamp(3rem,9.5vw,8.25rem)]"
            style={{ willChange: 'transform' }}
          >
            <span className="mask-line">
              <span className="reveal-inner hero-mask-inner">Building AI</span>
            </span>
            <span className="mask-line">
              <span className="reveal-inner hero-mask-inner">Agents &</span>
            </span>
            <span className="mask-line">
              <span className="reveal-inner hero-mask-inner">
                <span className="text-amber">RAG</span> Pipelines
              </span>
            </span>
          </h1>

          {/* === Layer 2: Bio + CTAs + Status + Stats + Scroll cue === */}
          <div
            ref={contentRef}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Bio + CTAs (left) / status line (right, off-grid) */}
            <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-12 items-end" data-reveal style={{ '--rd': '360ms' } as any}>
              <div className="md:col-span-5 lg:col-span-4">
                <p className="text-base sm:text-lg leading-relaxed text-ink/80">
                  Hi, I&apos;m <strong className="text-ink font-semibold">Tushar Kiran</strong>. I architect
                  production LLM applications, retrieval-augmented generation systems, and agentic
                  workflows for enterprise engineering platforms.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="#projects"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber text-char font-mono text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#ffc233] transition-colors duration-300"
                  >
                    Explore Projects →
                  </a>
                  <a
                    href="#experience"
                    className="inline-flex items-center gap-2 px-7 py-3.5 border border-rule text-ink font-mono text-xs uppercase tracking-[0.18em] hover:border-amber-dim hover:text-amber transition-colors duration-300"
                  >
                    View Experience
                  </a>
                </div>
              </div>
              <div className="md:col-span-7 lg:col-span-8 flex md:justify-end">
                <p className="font-mono text-xs sm:text-sm text-muted">
                  [ AI/ML Specialist · Munich, Germany ]<span className="caret" aria-hidden="true" />
                </p>
              </div>
            </div>

            {/* Stats — hairline-divided row, mono numerals */}
            <div
              className="mt-14 md:mt-20 border-t border-rule grid grid-cols-2 md:grid-cols-4"
              data-reveal
              style={{ '--rd': '520ms' } as any}
            >
              <div className="py-6 md:pr-8 md:border-r md:border-rule">
                <p className="font-mono text-3xl sm:text-4xl text-ink">11+</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">AI/ML Projects</p>
              </div>
              <div className="py-6 md:px-8 md:border-r md:border-rule">
                <p className="font-mono text-3xl sm:text-4xl text-ink">150+</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Students Mentored</p>
              </div>
              <div className="py-6 md:px-8 md:border-r md:border-rule col-span-2 md:col-span-1">
                <p className="font-mono text-3xl sm:text-4xl text-amber">M.Sc.</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Artificial Intelligence</p>
              </div>
              <div className="py-6 md:pl-8 col-span-2 md:col-span-1">
                <p className="font-mono text-3xl sm:text-4xl text-ink">15+</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Batch Automation</p>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="mt-12 flex items-center gap-3 scroll-cue" aria-hidden="true" data-reveal style={{ '--rd': '600ms' } as any}>
              <span className="w-px h-8 bg-amber-dim" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Scroll to explore</span>
            </div>
          </div>
        </div>

        {/* HUD telemetry readout — top-right under navbar */}
        <div
          ref={hudRef}
          className="hud-readout absolute top-24 right-4 sm:right-6 z-20 hidden sm:block"
          aria-hidden="true"
        >
          SCROLL    0.0%
DEPTH      0
SIGNAL ● INIT
DIR ↓
        </div>
      </div>
    </>
  );
}