import { useEffect, useRef } from 'react';
import { subscribe } from '../lib/scrollStore';

/*
 * FlowField — 3D Perspective Grid & Spatial Neural Engine.
 *
 * A hand-built 2D-canvas projection of a real 3D scene: an architectural floor
 * receding to a vanishing horizon, a cloud of spatial neural nodes, and synapse
 * links with travelling signal pulses. The whole scene is camera-flighted by page
 * scroll and tilted by the pointer, and its structure re-organizes per section
 * so the background "reads" the data you're scrolling through.
 *
 * Geometry is guaranteed on-screen: the camera sits at a negative z and every
 * node and grid line lives in front of the near plane, so nothing is silently
 * clipped to a black void.
 *
 *  - Real perspective projection (world X/Y/Z -> screen) with focal depth.
 *  - Section-aligned structural changes (RAG lanes -> timeline spine -> matrix
 *    lattice -> convergence) mapped to scroll progress.
 *  - Parallax & tilt: mouse position tilts the camera; a gentle idle dolly keeps
 *    the scene alive at rest.
 *  - Reduced motion: one static, fully-composed frame, no loop.
 */

type Vec3 = { x: number; y: number; z: number };

type Camera = {
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
  focal: number;
};

type SectionState = {
  camY: number;
  camZ: number;
  pitch: number;
  yaw: number;
  lanes: number; // 0..1 split into 3 RAG columns
  vertical: number; // 0..1 lock to central timeline spine
  lattice: number; // 0..1 orthogonal matrix quantization
  converge: number; // 0..1 pull toward a focal point
  label: string;
};

// camY/camZ are kept in a band that always leaves the geometry in front of the
// camera; pitch stays small so depth-rotated points never cross the near plane.
const SECTIONS: SectionState[] = [
  { camY: 0, camZ: -350, pitch: 0.3, yaw: 0, lanes: 0, vertical: 0, lattice: 0, converge: 0, label: '3D_HORIZON_INIT' }, // Hero
  { camY: 60, camZ: -480, pitch: 0.42, yaw: 0, lanes: 1, vertical: 0, lattice: 0, converge: 0, label: 'RAG_PIPELINE_SPLIT' }, // About
  { camY: 140, camZ: -420, pitch: 0.18, yaw: 0, lanes: 0, vertical: 1, lattice: 0, converge: 0, label: 'TIMELINE_SPINE' }, // Experience
  { camY: 120, camZ: -520, pitch: 0.36, yaw: 0, lanes: 0, vertical: 0, lattice: 1, converge: 0, label: 'MATRIX_LATTICE' }, // Skills
  { camY: 200, camZ: -600, pitch: 0.24, yaw: 0, lanes: 0, vertical: 0, lattice: 0, converge: 0, label: 'SPATIAL_PROJECTS' }, // Projects
  { camY: 320, camZ: -720, pitch: 0.48, yaw: 0, lanes: 0, vertical: 0, lattice: 0, converge: 1, label: 'CORE_CONVERGENCE' }, // Contact
];

type Node3D = {
  base: Vec3; // original 3D position
  curr: Vec3; // interpolated 3D position
  size: number;
  tint: string;
  laneIndex: number;
  phase: number;
  speed: number;
};

type SignalPulse = {
  fromNode: number;
  toNode: number;
  progress: number; // 0..1
  speed: number;
};

const TINTS = ['255,176,0', '255,209,102', '236,233,226']; // amber, bright amber, soft ink
const FLOOR_Y = -250; // floor sits below camera level so it projects to the lower half

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let W = 0;
    let H = 0;
    let DPR = 1;
    let scrollY = window.scrollY || 0;
    let lastScrollY = scrollY;
    let scrollVelocity = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let clock = 0;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      DPR = Math.min(window.devicePixelRatio || 1, 1.75);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function onMouseMove(e: MouseEvent) {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Measure page sections to map scroll to camera position.
    let sectionOffsets: number[] = [];
    function updateSectionOffsets() {
      const ids = ['hero', 'about', 'experience', 'skills', 'projects', 'contact'];
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const found = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return (el.getBoundingClientRect().top + window.scrollY) / maxScroll;
      });
      if (found.some((v) => v === null)) {
        // Fallback distribution if any anchor is missing.
        sectionOffsets = [0, 0.18, 0.38, 0.58, 0.78, 0.96];
      } else {
        sectionOffsets = found as number[];
      }
    }
    updateSectionOffsets();
    window.addEventListener('resize', updateSectionOffsets, { passive: true });

    // Initialize the 3D node cloud — all in front of the (negative-z) camera.
    const NODE_COUNT = W < 768 ? 40 : 90;
    const nodes: Node3D[] = [];
    const LANE_X = [-320, 0, 320];

    for (let i = 0; i < NODE_COUNT; i++) {
      const base: Vec3 = {
        x: (Math.random() - 0.5) * 1300, // -650..650
        y: Math.random() * 950, // 0..950 (above the floor)
        z: 150 + Math.random() * 1150, // 150..1300
      };
      nodes.push({
        base,
        curr: { ...base },
        size: 1.8 + Math.random() * 2.4,
        tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        laneIndex: i % 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.9,
      });
    }

    const pulses: SignalPulse[] = [];
    function spawnPulse() {
      if (nodes.length < 2) return;
      const i = Math.floor(Math.random() * nodes.length);
      let nearest = -1;
      let minDist = Infinity;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dx = nodes[i].curr.x - nodes[j].curr.x;
        const dy = nodes[i].curr.y - nodes[j].curr.y;
        const dz = nodes[i].curr.z - nodes[j].curr.z;
        const d = dx * dx + dy * dy + dz * dz;
        if (d < minDist && d < 340 * 340) {
          minDist = d;
          nearest = j;
        }
      }
      if (nearest !== -1) {
        pulses.push({ fromNode: i, toNode: nearest, progress: 0, speed: 0.8 + Math.random() * 1.4 });
      }
    }

    const camera: Camera = { x: 0, y: 0, z: -350, pitch: 0.3, yaw: 0, focal: 600 };

    // Perspective projection (pitch then yaw), clipping anything behind the near plane.
    function project3D(wx: number, wy: number, wz: number) {
      let dx = wx - camera.x;
      let dy = wy - camera.y;
      let dz = wz - camera.z;

      if (camera.pitch !== 0) {
        const cp = Math.cos(camera.pitch);
        const sp = Math.sin(camera.pitch);
        const ndy = dy * cp - dz * sp;
        const ndz = dy * sp + dz * cp;
        dy = ndy;
        dz = ndz;
      }
      if (camera.yaw !== 0) {
        const cy = Math.cos(camera.yaw);
        const sy = Math.sin(camera.yaw);
        const ndx = dx * cy + dz * sy;
        const ndz = -dx * sy + dz * cy;
        dx = ndx;
        dz = ndz;
      }

      if (dz < 20) return null; // behind the near plane

      const scale = camera.focal / dz;
      const sx = W * 0.5 + dx * scale;
      const sy = H * 0.5 - dy * scale; // world-up maps to screen-up

      return { sx, sy, scale, dz };
    }

    function getSectionState(progress: number): SectionState {
      if (sectionOffsets.length === 0) return SECTIONS[0];
      let idx = 0;
      while (idx < sectionOffsets.length - 1 && progress >= sectionOffsets[idx + 1]) idx++;
      if (idx >= SECTIONS.length - 1) return SECTIONS[SECTIONS.length - 1];

      const p0 = sectionOffsets[idx];
      const p1 = sectionOffsets[idx + 1];
      const segT = Math.max(0, Math.min(1, (progress - p0) / Math.max(0.001, p1 - p0)));
      const t = segT * segT * (3 - 2 * segT); // smoothstep

      const a = SECTIONS[idx];
      const b = SECTIONS[idx + 1];
      return {
        camY: lerp(a.camY, b.camY, t),
        camZ: lerp(a.camZ, b.camZ, t),
        pitch: lerp(a.pitch, b.pitch, t),
        yaw: lerp(a.yaw, b.yaw, t),
        lanes: lerp(a.lanes, b.lanes, t),
        vertical: lerp(a.vertical, b.vertical, t),
        lattice: lerp(a.lattice, b.lattice, t),
        converge: lerp(a.converge, b.converge, t),
        label: segT < 0.5 ? a.label : b.label,
      };
    }

    const unsubscribeScroll = subscribe((currentScrollY, progress) => {
      scrollY = currentScrollY;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    });

    function drawFrame(dt: number, animate: boolean) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
      const sec = getSectionState(scrollProgress);

      // Camera easing toward the section target, plus a gentle idle dolly for life.
      const dolly = animate ? Math.sin(clock * 0.3) * 12 : 0;
      camera.y = lerp(camera.y, sec.camY, 0.06);
      camera.z = lerp(camera.z, sec.camZ + dolly, 0.05);
      camera.pitch = lerp(camera.pitch, sec.pitch + mouseY * 0.05, 0.06);
      camera.yaw = lerp(camera.yaw, sec.yaw + mouseX * 0.07, 0.06);

      ctx.save();
      ctx.scale(DPR, DPR);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      // 1. Architectural floor: longitudinal + transverse perspective lines.
      ctx.lineWidth = 1;

      for (let x = -1100; x <= 1100; x += 175) {
        const p1 = project3D(x, FLOOR_Y, 40);
        const p2 = project3D(x, FLOOR_Y, 1400);
        if (p1 && p2) {
          const alpha = Math.max(0.02, 0.26 - Math.abs(x) / 4200);
          ctx.strokeStyle = `rgba(255,176,0,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }
      for (let z = 60; z <= 1400; z += 95) {
        const p1 = project3D(-1100, FLOOR_Y, z);
        const p2 = project3D(1100, FLOOR_Y, z);
        if (p1 && p2) {
          const depth = (z - 60) / (1400 - 60);
          const alpha = Math.max(0.02, 0.3 * (1 - depth));
          ctx.strokeStyle = `rgba(255,176,0,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      // Soft horizon glow at the vanishing point.
      const horizon = project3D(0, FLOOR_Y, 3000);
      if (horizon) {
        const grad = ctx.createRadialGradient(horizon.sx, horizon.sy, 0, horizon.sx, horizon.sy, Math.max(60, H * 0.4));
        grad.addColorStop(0, 'rgba(255,176,0,0.14)');
        grad.addColorStop(1, 'rgba(255,176,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // 2. Update + project the node cloud.
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (animate) n.phase += dt * n.speed * (1 + (scrollVelocity > 5 ? 1.2 : 0));

        let tx = n.base.x;
        let ty = n.base.y;
        let tz = n.base.z;

        if (sec.lanes > 0.01) tx = lerp(tx, LANE_X[n.laneIndex], sec.lanes);
        if (sec.vertical > 0.01) {
          tx = lerp(tx, 0, sec.vertical);
          tz = lerp(tz, 520, sec.vertical);
        }
        if (sec.lattice > 0.01) {
          const qx = Math.round(tx / 200) * 200;
          const qz = Math.round(tz / 160) * 160;
          tx = lerp(tx, qx, sec.lattice);
          tz = lerp(tz, qz, sec.lattice);
        }
        if (sec.converge > 0.01) {
          tx = lerp(tx, 0, sec.converge);
          ty = lerp(ty, 420, sec.converge * 0.7);
          tz = lerp(tz, 560, sec.converge);
        }

        const fx = Math.sin(n.phase) * 14;
        const fy = Math.cos(n.phase * 0.8) * 10;
        const fz = Math.sin(n.phase * 1.2) * 12;

        n.curr.x = lerp(n.curr.x, tx + fx, 0.06);
        n.curr.y = lerp(n.curr.y, ty + fy, 0.06);
        n.curr.z = lerp(n.curr.z, tz + fz, 0.06);
      }

      const projected = nodes
        .map((node) => ({ node, ...project3D(node.curr.x, node.curr.y, node.curr.z) }))
        .filter((p): p is { node: Node3D; sx: number; sy: number; scale: number; dz: number } => p !== null);

      projected.sort((a, b) => b.dz - a.dz); // far to near

      // 3. Synapse links between nearby nodes.
      const maxLink = 320;
      for (let i = 0; i < projected.length; i++) {
        const pA = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const pB = projected[j];
          const dx = pA.node.curr.x - pB.node.curr.x;
          const dy = pA.node.curr.y - pB.node.curr.y;
          const dz = pA.node.curr.z - pB.node.curr.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < maxLink * maxLink) {
            const dist = Math.sqrt(distSq);
            const fade = 1 - dist / maxLink;
            const alpha = fade * 0.26 * Math.min(pA.scale, pB.scale);
            if (alpha <= 0.01) continue;
            ctx.strokeStyle = `rgba(255,176,0,${alpha.toFixed(3)})`;
            ctx.lineWidth = Math.max(0.6, 1.1 * pA.scale);
            ctx.beginPath();
            ctx.moveTo(pA.sx, pA.sy);
            ctx.lineTo(pB.sx, pB.sy);
            ctx.stroke();
          }
        }
      }

      // 4. Nodes: soft halo + bright core.
      for (const p of projected) {
        const radius = Math.max(1, p.node.size * p.scale);
        const alpha = Math.min(0.9, 0.9 * (1 - p.dz / 1600));
        if (alpha <= 0.02) continue;

        ctx.fillStyle = `rgba(${p.node.tint},${(alpha * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius * 3.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${p.node.tint},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Travelling signal pulses.
      if (animate && Math.random() < 0.16 + (scrollVelocity > 3 ? 0.35 : 0)) spawnPulse();
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (animate) pulse.progress += dt * pulse.speed;
        if (pulse.progress >= 1 || pulse.fromNode >= nodes.length || pulse.toNode >= nodes.length) {
          pulses.splice(i, 1);
          continue;
        }
        const nA = nodes[pulse.fromNode];
        const nB = nodes[pulse.toNode];
        const pp = project3D(
          lerp(nA.curr.x, nB.curr.x, pulse.progress),
          lerp(nA.curr.y, nB.curr.y, pulse.progress),
          lerp(nA.curr.z, nB.curr.z, pulse.progress),
        );
        if (pp) {
          const pr = Math.max(1.5, 3.4 * pp.scale);
          ctx.shadowColor = 'rgba(255,176,0,0.85)';
          ctx.shadowBlur = 10 * pp.scale;
          ctx.fillStyle = 'rgba(255,209,102,0.95)';
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, pr, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // 6. HUD telemetry decal.
      if (W > 768) {
        ctx.font = '10px "IBM Plex Mono", monospace';
        ctx.fillStyle = 'rgba(255,176,0,0.4)';
        ctx.fillText(`[ ${sec.label} ]`, 24, H - 24);
        ctx.fillText(`CAM_Y ${Math.round(camera.y)} · Z ${Math.round(camera.z)}`, 24, H - 40);
      }

      ctx.restore();
    }

    if (reducedMotion) {
      // One fully-composed static frame, no loop.
      drawFrame(0, false);
      return;
    }

    let lastTime = performance.now();
    function render(now: number) {
      animId = requestAnimationFrame(render);
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.05, rawDt);
      clock += dt;

      const deltaY = scrollY - lastScrollY;
      lastScrollY = scrollY;
      scrollVelocity = lerp(scrollVelocity, Math.abs(deltaY), 0.1);
      mouseX = lerp(mouseX, targetMouseX, 0.08);
      mouseY = lerp(mouseY, targetMouseY, 0.08);

      drawFrame(dt, true);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', updateSectionOffsets);
      unsubscribeScroll();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />
      <div
        ref={barRef}
        className="scroll-progress fixed top-0 left-0 h-[2px] w-full bg-amber z-50 pointer-events-none origin-left"
        aria-hidden="true"
      />
    </>
  );
}
