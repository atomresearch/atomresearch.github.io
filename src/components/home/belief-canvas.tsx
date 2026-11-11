import { useEffect, useRef } from "react";

/*
 * Hero figure: a particle filter tracking a hidden state.
 *
 * A cloud of hypotheses (particles) starts spread over the whole space. A
 * hidden state moves around; at regular intervals a noisy observation of it
 * arrives, each hypothesis is reweighted by how well it explains that
 * observation, and the cloud contracts around the truth. The trace along the
 * bottom is the entropy of the belief. Every so often the belief is reset to
 * the prior and the process starts again.
 *
 * Plain 2D canvas, no dependencies. The loop only runs while the canvas is on
 * screen and the tab is visible; with `prefers-reduced-motion` a single
 * representative frame is drawn instead.
 */

// Simulation constants. Lengths are in units of the shorter canvas side.
const OBS_INTERVAL = 0.85; // seconds between observations
const EPISODE = 17; // seconds before the belief is reset to the prior
const PROCESS_NOISE = 0.05; // diffusion of hypotheses, per sqrt(second)
const OBS_NOISE = 0.03; // noise on each observation
const KERNEL = 0.16; // width of the likelihood kernel once the episode is under way
const KERNEL_START = 0.3; // extra width at the start of an episode: learn gradually
const PULSE_LIFE = 1.3; // seconds an observation stays visible
const TRACE_SAMPLES = 150;
const STATIC_TIME = 3.7; // simulated time of the reduced-motion frame

type Colors = { primary: string; signal: string; ink: string; muted: string };

function readColors(): Colors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return {
    primary: get("--primary"),
    signal: get("--signal"),
    ink: get("--foreground"),
    muted: get("--muted-foreground"),
  };
}

/** Small seeded generator, so the static frame is the same on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createSimulation(width: number, height: number) {
  const unit = Math.min(width, height);
  const w = width / unit;
  const h = height / unit;
  const count = Math.round(Math.min(320, Math.max(130, (width * height) / 1300)));
  const rand = mulberry32(7);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };

  const px = new Float32Array(count);
  const py = new Float32Array(count);
  const weight = new Float32Array(count);
  const tmpX = new Float32Array(count);
  const tmpY = new Float32Array(count);

  // The hidden state follows a slow closed curve in the upper part of the
  // canvas (the bottom band is kept for the entropy trace).
  const centre = { x: w / 2, y: h * 0.42 };
  const radius = { x: w * 0.33, y: h * 0.24 };
  const pathAt = (t: number) => ({
    x: centre.x + radius.x * Math.sin(0.23 * t + 2.6),
    y: centre.y + radius.y * Math.sin(0.31 * t - 0.9),
  });

  const state = {
    t: 0,
    episodeStart: 0,
    nextObs: OBS_INTERVAL,
    target: pathAt(0),
    pointer: null as { x: number; y: number } | null,
    mean: { x: centre.x, y: centre.y },
    cov: { xx: 1, xy: 0, yy: 1 },
    pulses: [] as { x: number; y: number; born: number }[],
    trace: [] as number[],
    nextTrace: 0,
  };

  const scatter = () => {
    for (let i = 0; i < count; i++) {
      px[i] = rand() * w;
      py[i] = rand() * h * 0.86;
      weight[i] = 1 / count;
    }
  };

  const summarise = () => {
    let mx = 0;
    let my = 0;
    for (let i = 0; i < count; i++) {
      mx += weight[i] * px[i];
      my += weight[i] * py[i];
    }
    let xx = 0;
    let xy = 0;
    let yy = 0;
    for (let i = 0; i < count; i++) {
      const dx = px[i] - mx;
      const dy = py[i] - my;
      xx += weight[i] * dx * dx;
      xy += weight[i] * dx * dy;
      yy += weight[i] * dy * dy;
    }
    state.mean = { x: mx, y: my };
    state.cov = { xx, xy, yy };
  };

  /** Reweight every hypothesis by how well it explains the observation. */
  const observe = () => {
    const ox = state.target.x + OBS_NOISE * gauss();
    const oy = state.target.y + OBS_NOISE * gauss();
    state.pulses.push({ x: ox, y: oy, born: state.t });

    // The kernel narrows over the first seconds of an episode, so the belief
    // contracts over several observations rather than at the first one.
    const kernel = KERNEL + KERNEL_START * Math.exp(-(state.t - state.episodeStart) / 2.2);
    let total = 0;
    for (let i = 0; i < count; i++) {
      const dx = px[i] - ox;
      const dy = py[i] - oy;
      weight[i] *= Math.exp(-(dx * dx + dy * dy) / (2 * kernel * kernel));
      total += weight[i];
    }
    if (total < 1e-30) {
      // Every hypothesis was far off: start again around the observation.
      for (let i = 0; i < count; i++) {
        px[i] = ox + kernel * gauss();
        py[i] = oy + kernel * gauss();
        weight[i] = 1 / count;
      }
      return;
    }
    let sumSquares = 0;
    for (let i = 0; i < count; i++) {
      weight[i] /= total;
      sumSquares += weight[i] * weight[i];
    }

    // Systematic resampling once too few hypotheses carry the weight.
    if (1 / sumSquares < count * 0.55) {
      const step = 1 / count;
      let u = rand() * step;
      let cumulative = weight[0];
      let j = 0;
      for (let i = 0; i < count; i++) {
        while (u > cumulative && j < count - 1) cumulative += weight[++j];
        tmpX[i] = px[j] + 0.012 * gauss();
        tmpY[i] = py[j] + 0.012 * gauss();
        u += step;
      }
      px.set(tmpX);
      py.set(tmpY);
      weight.fill(step);
    }
  };

  const step = (dt: number) => {
    state.t += dt;

    if (state.t - state.episodeStart > EPISODE) {
      state.episodeStart = state.t;
      scatter();
    }

    // Move the hidden state: along its path, or towards the pointer.
    const goal = state.pointer ?? pathAt(state.t);
    const ease = 1 - Math.exp(-dt * (state.pointer ? 6 : 3));
    const vx = (goal.x - state.target.x) * ease;
    const vy = (goal.y - state.target.y) * ease;
    state.target.x += vx;
    state.target.y += vy;

    // Transition model: hypotheses follow the dynamics, plus process noise.
    const noise = PROCESS_NOISE * Math.sqrt(dt);
    for (let i = 0; i < count; i++) {
      px[i] += vx + noise * gauss();
      py[i] += vy + noise * gauss();
    }

    if (state.t >= state.nextObs) {
      state.nextObs = state.t + OBS_INTERVAL;
      observe();
    }
    while (state.pulses.length && state.t - state.pulses[0].born > PULSE_LIFE) {
      state.pulses.shift();
    }

    summarise();

    if (state.t >= state.nextTrace) {
      state.nextTrace = state.t + 0.1;
      // Entropy of a Gaussian with the same covariance, mapped to 0..1.
      const det = Math.max(state.cov.xx * state.cov.yy - state.cov.xy ** 2, 1e-12);
      const entropy = 0.5 * Math.log(det);
      state.trace.push(Math.min(1, Math.max(0, (entropy + 6.4) / 4.2)));
      if (state.trace.length > TRACE_SAMPLES) state.trace.shift();
    }
  };

  scatter();
  summarise();

  return { state, step, count, px, py, weight, unit };
}

type Simulation = ReturnType<typeof createSimulation>;

function draw(
  ctx: CanvasRenderingContext2D,
  sim: Simulation,
  colors: Colors,
  width: number,
  height: number,
) {
  const { state, count, px, py, weight, unit } = sim;
  ctx.clearRect(0, 0, width, height);

  // Fade the cloud in at the start of each episode and out at its end.
  const age = state.t - state.episodeStart;
  const fade = Math.min(1, age / 0.7, (EPISODE - age) / 0.6);

  // Entropy trace along the bottom edge.
  if (state.trace.length > 1) {
    const left = 16;
    const right = width - 16;
    const base = height - 14;
    const amplitude = Math.min(34, height * 0.1);
    ctx.beginPath();
    state.trace.forEach((value, i) => {
      const x = left + ((right - left) * i) / (TRACE_SAMPLES - 1);
      const y = base - value * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = colors.muted;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.25;
    ctx.lineJoin = "round";
    ctx.stroke();
  }

  // Two-sigma ellipse of the belief.
  const { xx, xy, yy } = state.cov;
  const mid = (xx + yy) / 2;
  const diff = Math.sqrt(((xx - yy) / 2) ** 2 + xy * xy);
  const major = 2 * Math.sqrt(Math.max(mid + diff, 0)) * unit;
  const minor = 2 * Math.sqrt(Math.max(mid - diff, 0)) * unit;
  ctx.beginPath();
  ctx.ellipse(
    state.mean.x * unit,
    state.mean.y * unit,
    major,
    minor,
    0.5 * Math.atan2(2 * xy, xx - yy),
    0,
    Math.PI * 2,
  );
  ctx.fillStyle = colors.primary;
  ctx.strokeStyle = colors.primary;
  ctx.globalAlpha = 0.05 * fade;
  ctx.fill();
  ctx.globalAlpha = 0.4 * fade;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Hypotheses: size and opacity follow their weight.
  ctx.fillStyle = colors.primary;
  for (let i = 0; i < count; i++) {
    const relative = Math.min(weight[i] * count, 4);
    ctx.globalAlpha = Math.min(0.85, 0.3 + 0.3 * relative) * fade;
    ctx.beginPath();
    ctx.arc(px[i] * unit, py[i] * unit, 1.1 + 0.9 * Math.sqrt(relative), 0, Math.PI * 2);
    ctx.fill();
  }

  // Hidden state.
  const tx = state.target.x * unit;
  const ty = state.target.y * unit;
  ctx.strokeStyle = colors.ink;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(tx, ty, 6, 0, Math.PI * 2);
  ctx.stroke();

  // Observations: a dot and an expanding ring.
  ctx.fillStyle = colors.signal;
  ctx.strokeStyle = colors.signal;
  for (const pulse of state.pulses) {
    const life = (state.t - pulse.born) / PULSE_LIFE;
    const x = pulse.x * unit;
    const y = pulse.y * unit;
    ctx.globalAlpha = 1 - life;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.7 * (1 - life) ** 2;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 5 + 46 * (1 - (1 - life) ** 3), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function BeliefCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let colors = readColors();
    let sim: Simulation | null = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let onScreen = false;

    const render = () => sim && draw(ctx, sim, colors, width, height);

    const drawStatic = () => {
      sim = createSimulation(width, height);
      for (let t = 0; t < STATIC_TIME; t += 1 / 30) sim.step(1 / 30);
      render();
    };

    const tick = (now: number) => {
      frame = 0;
      if (!sim) return;
      // `last` is 0 on the first frame after a pause: assume one 60 Hz frame.
      const dt = last ? Math.min(Math.max((now - last) / 1000, 0), 0.05) : 1 / 60;
      last = now;
      sim.step(dt);
      render();
      schedule();
    };

    const schedule = () => {
      if (frame || reducedMotion.matches || !onScreen || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 1) return;
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reducedMotion.matches) {
        drawStatic();
      } else {
        // Start part-way in, so the first paint already shows a belief.
        sim = createSimulation(width, height);
        for (let t = 0; t < 0.6; t += 1 / 30) sim.step(1 / 30);
        render();
        schedule();
      }
    };

    const onMotionChange = () => {
      stop();
      width = 0;
      resize();
    };

    const onVisibility = () => (document.hidden ? stop() : schedule());

    const onPointerMove = (event: PointerEvent) => {
      if (!sim || event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      sim.state.pointer = {
        x: (event.clientX - rect.left) / sim.unit,
        y: (event.clientY - rect.top) / sim.unit,
      };
    };
    const onPointerLeave = () => {
      if (sim) sim.state.pointer = null;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) schedule();
      else stop();
    });
    intersectionObserver.observe(canvas);

    // Repaint with the new palette when the theme changes.
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (!frame) render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    reducedMotion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
