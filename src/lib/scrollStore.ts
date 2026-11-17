// Vanilla scroll store — one shared scroll clock for all cinematic layers.
// Using a single rAF-throttled listener keeps scroll-driven transforms
// (Three.js camera, parallax, progress bar) on one frame budget.

type ScrollListener = (y: number, progress: number, direction: 1 | -1) => void;

const listeners = new Set<ScrollListener>();
let y = 0;
let progress = 0;
let direction: 1 | -1 = 1;
let lastY = 0;
let rafId: number | null = null;

function compute() {
  y = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress = max > 0 ? Math.min(1, y / max) : 0;
  direction = y > lastY ? 1 : -1;
  lastY = y;
}

function flush() {
  rafId = null;
  compute();
  listeners.forEach((l) => l(y, progress, direction));
}

function schedule() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(flush);
}

export function subscribe(listener: ScrollListener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', flush);
    flush();
  }
  listener(y, progress, direction);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', flush);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}

export function getScroll() {
  return { y, progress, direction };
}