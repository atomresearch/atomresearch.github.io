import { useEffect, useRef } from "react";
import { DEMO_WORLDS, type BlocksDemo, type GridDemo, type MinesDemo } from "./gridworld-demos";

/*
 * Hero figure: an agent discovering worlds it has never seen.
 *
 * Adapted from Mathis Fajeau's environment animation in his Pinductor article
 * (https://mtsfj.github.io/articles/pinductor.html, section "Five gridworlds,
 * one observation interface"), redrawn as a light 2D canvas. Credit and thanks
 * to Mathis; the page credits him under the figure too. The runs are real
 * demonstrations from the released Pinductor demonstration files, replayed
 * with the same dynamics and observations as the paper's code (data in
 * gridworld-demos.ts).
 *
 * The loop: Four Rooms, Blocks World, Unlock, MineSweeper.
 * - Gridworlds: the agent sees only the 3×3 window in front of it (blue), so
 *   the map is revealed as it moves; at the goal, the true map fades in.
 * - Blocks World: the gripper sees only the stack beneath it and the block in
 *   its hand; it builds the target tower (dashed) on the left.
 * - MineSweeper: each click shows only the number of mines next to that cell;
 *   once the board is cleared, the mines are shown.
 *
 * Plain 2D canvas, no dependencies. The loop only runs while the canvas is on
 * screen and the tab is visible; with `prefers-reduced-motion` a single frame
 * is drawn instead.
 */

// Timing, in seconds.
const FADE_IN = 0.45;
const HOLD = 0.75; // at the goal, before the true state fades in
const REVEAL = 1.9; // how long the true state stays visible
const SETTLE = 0.6; // pause at the end when nothing was hidden
const FADE_OUT = 0.45;
const STEP = { grid: 0.3, blocks: 0.2, mines: 0.5 } as const; // one action
const TRUTH_ALPHA = 0.3; // opacity of never-seen cells once the true map is shown

// Fixed colours, after Mathis's palette; everything else follows the site theme.
const LAVA = "#ff6a1f";
const GOAL = "#2ec27e";
const KEY = "#f5b301";
const AGENT = "#e5484d";

const SEEN = "what the agent has seen";

// ---------- MiniGrid ----------

// Cell codes, as in the paper's code.
const EMPTY = 1;
const WALL = 2;
const OPEN_DOOR = 4;
const CLOSED_DOOR = 5;
const LOCKED_DOOR = 6;
const KEY_CELL = 7;
const GOAL_CELL = 10;
const LAVA_CELL = 11;
const CODE: Record<string, number> = {
  "#": WALL,
  ".": EMPTY,
  "~": LAVA_CELL,
  G: GOAL_CELL,
  K: KEY_CELL,
  L: LOCKED_DOOR,
};
const PASSABLE = new Set([EMPTY, OPEN_DOOR, GOAL_CELL, LAVA_CELL]);
const DIRV = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

type Base = { world: string; n: number; step: number; duration: number; hidden: boolean };
type GridFrame = { x: number; y: number; dir: number; carrying: boolean; cells: Uint8Array };
type GridEpisode = Base & {
  kind: "grid";
  W: number;
  H: number;
  frames: GridFrame[];
  firstSeen: Int16Array; // frame at which each cell is first seen; -1 if never
};
type BlocksFrame = { stacks: number[][]; pos: number; held: number };
type BlocksEpisode = Base & {
  kind: "blocks";
  frames: BlocksFrame[];
  firstVisit: number[]; // frame at which each column is first under the gripper
  target: number[][];
};
type MinesEpisode = Base & {
  kind: "mines";
  rows: number;
  cols: number;
  mines: Uint8Array;
  counts: Uint8Array;
  clicks: number[]; // cell clicked to reach each frame; -1 for the first
  revealedAt: Int16Array; // frame at which each cell is revealed; -1 if never
};
type Episode = GridEpisode | BlocksEpisode | MinesEpisode;
type Colors = { ink: string; primary: string; card: string; mono: string };

function readColors(): Colors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return {
    ink: get("--foreground"),
    primary: get("--primary"),
    card: get("--card"),
    mono: get("--font-mono") || "ui-monospace, monospace",
  };
}

function timing(n: number, step: number, hidden: boolean) {
  return FADE_IN + (n - 1) * step + HOLD + (hidden ? REVEAL : SETTLE) + FADE_OUT;
}

/** Top-left cell of the 3×3 field of view: the agent sits in the middle of its back row. */
function fovOrigin(x: number, y: number, dir: number): [number, number] {
  if (dir === 0) return [x, y - 1];
  if (dir === 1) return [x - 1, y];
  if (dir === 2) return [x - 2, y - 1];
  return [x - 1, y - 2];
}

/** Replay a gridworld demonstration in the true environment, recording what the agent sees. */
function replayGrid(demo: GridDemo, world: string): GridEpisode {
  const H = demo.grid.length;
  const W = demo.grid[0].length;
  let cells = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) cells[y * W + x] = CODE[demo.grid[y][x]] ?? EMPTY;
  let [x, y] = demo.pos;
  let dir = demo.dir;
  let carrying = false;
  const firstSeen = new Int16Array(W * H).fill(-1);
  const frames: GridFrame[] = [];

  const record = () => {
    const [ox, oy] = fovOrigin(x, y, dir);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        const cx = ox + i;
        const cy = oy + j;
        if (cx >= 0 && cy >= 0 && cx < W && cy < H && firstSeen[cy * W + cx] < 0)
          firstSeen[cy * W + cx] = frames.length;
      }
    frames.push({ x, y, dir, carrying, cells });
  };

  record();
  for (const action of demo.actions) {
    const fx = x + DIRV[dir][0];
    const fy = y + DIRV[dir][1];
    const front = fx >= 0 && fy >= 0 && fx < W && fy < H ? fy * W + fx : -1;
    if (action === 0) dir = (dir + 3) % 4;
    else if (action === 1) dir = (dir + 1) % 4;
    else if (action === 2) {
      if (front >= 0 && PASSABLE.has(cells[front])) {
        x = fx;
        y = fy;
      }
    } else if (action === 3) {
      if (!carrying && front >= 0 && cells[front] === KEY_CELL) {
        cells = cells.slice();
        cells[front] = EMPTY;
        carrying = true;
      }
    } else if (action === 5 && front >= 0) {
      const c = cells[front];
      const next =
        (c === LOCKED_DOOR && carrying) || c === CLOSED_DOOR
          ? OPEN_DOOR
          : c === OPEN_DOOR
            ? CLOSED_DOOR
            : c;
      if (next !== c) {
        cells = cells.slice();
        cells[front] = next;
      }
    }
    record();
    const here = cells[y * W + x];
    if (here === GOAL_CELL || here === LAVA_CELL) break;
  }

  const n = frames.length;
  return {
    kind: "grid",
    world,
    W,
    H,
    frames,
    firstSeen,
    n,
    step: STEP.grid,
    hidden: true,
    duration: timing(n, STEP.grid, true),
  };
}

/** Blocks World: pick and drop numbered blocks over three columns. */
function replayBlocks(demo: BlocksDemo, world: string): BlocksEpisode {
  let stacks = demo.stacks.map((column) => column.slice());
  let pos = demo.pos;
  let held = 0;
  const frames: BlocksFrame[] = [{ stacks, pos, held }];
  const firstVisit: number[] = stacks.map((_, c) => (c === pos ? 0 : -1));
  const solved = () =>
    held === 0 &&
    stacks.every(
      (column, c) =>
        column.length === demo.target[c].length && column.every((b, j) => b === demo.target[c][j]),
    );

  for (const action of demo.actions) {
    if (action === 0 && pos > 0) pos--;
    else if (action === 1 && pos < stacks.length - 1) pos++;
    else if (action === 2 && held === 0 && stacks[pos].length) {
      stacks = stacks.map((column) => column.slice());
      held = stacks[pos].pop() ?? 0;
    } else if (action === 3 && held !== 0) {
      stacks = stacks.map((column) => column.slice());
      stacks[pos].push(held);
      held = 0;
    }
    if (firstVisit[pos] < 0) firstVisit[pos] = frames.length;
    frames.push({ stacks, pos, held });
    if (solved()) break;
  }

  const n = frames.length;
  const hidden = firstVisit.some((v) => v < 0);
  return {
    kind: "blocks",
    world,
    frames,
    firstVisit,
    target: demo.target,
    n,
    step: STEP.blocks,
    hidden,
    duration: timing(n, STEP.blocks, hidden),
  };
}

/** MineSweeper (PopGym): a click reveals the number of mines next to that cell. */
function replayMines(demo: MinesDemo, world: string): MinesEpisode {
  const [rows, cols] = demo.dims;
  const mines = Uint8Array.from(demo.mines);
  const counts = new Uint8Array(rows * cols);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if ((dr || dc) && rr >= 0 && cc >= 0 && rr < rows && cc < cols && mines[rr * cols + cc])
            counts[r * cols + c]++;
        }
  const revealedAt = new Int16Array(rows * cols).fill(-1);
  const clicks = [-1];
  for (const cell of demo.actions) {
    clicks.push(cell);
    if (mines[cell]) break;
    if (revealedAt[cell] < 0) revealedAt[cell] = clicks.length - 1;
  }
  const n = clicks.length;
  return {
    kind: "mines",
    world,
    rows,
    cols,
    mines,
    counts,
    clicks,
    revealedAt,
    n,
    step: STEP.mines,
    hidden: true,
    duration: timing(n, STEP.mines, true),
  };
}

/** One run per world in turn, then the next runs. */
function buildEpisodes(): Episode[] {
  const episodes: Episode[] = [];
  const rounds = Math.max(...DEMO_WORLDS.map((w) => w.demos.length));
  for (let r = 0; r < rounds; r++)
    for (const world of DEMO_WORLDS) {
      if (world.kind === "grid" && world.demos[r])
        episodes.push(replayGrid(world.demos[r], world.name));
      if (world.kind === "blocks" && world.demos[r])
        episodes.push(replayBlocks(world.demos[r], world.name));
      if (world.kind === "mines" && world.demos[r])
        episodes.push(replayMines(world.demos[r], world.name));
    }
  return episodes;
}

// ---------- Drawing ----------

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (k: number) => k * k * (3 - 2 * k);

type Moment = {
  i: number; // current frame
  k: number; // fraction of the way to the next frame
  steps: number; // i + k
  motion: number; // eased k, complete at 70% of the step
  atEnd: number; // seconds since the run ended (negative before)
  reveal: number; // 0..1, true state shown
  fade: number; // episode fade in and out
};
type Area = { x: number; y: number; w: number; h: number };

function momentOf(ep: Episode, elapsed: number): Moment {
  const runEnd = FADE_IN + (ep.n - 1) * ep.step;
  const run = Math.min(Math.max(elapsed - FADE_IN, 0), (ep.n - 1) * ep.step);
  const i = Math.min(Math.floor(run / ep.step), ep.n - 1);
  const k = i >= ep.n - 1 ? 0 : (run - i * ep.step) / ep.step;
  return {
    i,
    k,
    steps: i + k,
    motion: smooth(clamp01(k / 0.7)),
    atEnd: elapsed - runEnd,
    reveal: ep.hidden ? smooth(clamp01((elapsed - runEnd - HOLD) / 0.6)) : 0,
    fade: Math.min(clamp01(elapsed / FADE_IN), clamp01((ep.duration - elapsed) / FADE_OUT)),
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** A tile the agent has not seen: a faint dashed outline. */
function drawUnseen(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  colors: Colors,
) {
  if (alpha <= 0.003) return;
  const gap = Math.max(1, size * 0.07);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 1;
  ctx.setLineDash([Math.max(2, size * 0.08), Math.max(2, size * 0.08)]);
  roundedRect(
    ctx,
    x + gap / 2 + 0.5,
    y + gap / 2 + 0.5,
    size - gap - 1,
    size - gap - 1,
    size * 0.14,
  );
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  code: number,
  x: number,
  y: number,
  cs: number,
  alpha: number,
  colors: Colors,
) {
  const gap = Math.max(1, cs * 0.07);
  const inner = cs - gap;
  const left = x + gap / 2;
  const top = y + gap / 2;
  const radius = cs * 0.14;

  // Floor tile.
  ctx.globalAlpha = alpha * 0.08;
  ctx.fillStyle = colors.ink;
  roundedRect(ctx, left, top, inner, inner, radius);
  ctx.fill();

  if (code === WALL) {
    ctx.globalAlpha = alpha * 0.42;
    ctx.fillStyle = colors.ink;
    roundedRect(ctx, left, top, inner, inner, radius);
    ctx.fill();
  } else if (code === LAVA_CELL) {
    ctx.globalAlpha = alpha * 0.88;
    ctx.fillStyle = LAVA;
    roundedRect(ctx, left, top, inner, inner, radius);
    ctx.fill();
    ctx.globalAlpha = alpha * 0.55;
    ctx.strokeStyle = "#ffd9c2";
    ctx.lineWidth = Math.max(1, cs * 0.06);
    ctx.lineCap = "round";
    ctx.beginPath();
    const mid = top + inner * 0.55;
    ctx.moveTo(left + inner * 0.22, mid);
    ctx.quadraticCurveTo(left + inner * 0.36, mid - inner * 0.16, left + inner * 0.5, mid);
    ctx.quadraticCurveTo(left + inner * 0.64, mid + inner * 0.16, left + inner * 0.78, mid);
    ctx.stroke();
  } else if (code === GOAL_CELL) {
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = GOAL;
    roundedRect(ctx, left, top, inner, inner, radius);
    ctx.fill();
  } else if (code === KEY_CELL) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = KEY;
    ctx.lineWidth = Math.max(1.2, cs * 0.08);
    ctx.lineCap = "round";
    const cy = y + cs / 2;
    ctx.beginPath();
    ctx.arc(x + cs * 0.36, cy, cs * 0.13, 0, Math.PI * 2);
    ctx.moveTo(x + cs * 0.49, cy);
    ctx.lineTo(x + cs * 0.78, cy);
    ctx.moveTo(x + cs * 0.7, cy);
    ctx.lineTo(x + cs * 0.7, cy + cs * 0.12);
    ctx.stroke();
  } else if (code === LOCKED_DOOR || code === CLOSED_DOOR || code === OPEN_DOOR) {
    const inset = cs * 0.12;
    if (code !== OPEN_DOOR) {
      ctx.globalAlpha = alpha * 0.22;
      ctx.fillStyle = KEY;
      roundedRect(
        ctx,
        left + inset,
        top + inset,
        inner - 2 * inset,
        inner - 2 * inset,
        radius * 0.6,
      );
      ctx.fill();
    }
    ctx.globalAlpha = alpha * (code === OPEN_DOOR ? 0.6 : 0.95);
    ctx.strokeStyle = KEY;
    ctx.lineWidth = Math.max(1.2, cs * 0.07);
    if (code === OPEN_DOOR) ctx.setLineDash([cs * 0.1, cs * 0.09]);
    roundedRect(ctx, left + inset, top + inset, inner - 2 * inset, inner - 2 * inset, radius * 0.6);
    ctx.stroke();
    ctx.setLineDash([]);
    if (code === LOCKED_DOOR) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = KEY;
      ctx.beginPath();
      ctx.arc(x + cs / 2, y + cs / 2, cs * 0.07, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** A blue window over what the agent is looking at. */
function drawView(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  alpha: number,
  colors: Colors,
) {
  roundedRect(ctx, x, y, w, h, r);
  ctx.globalAlpha = 0.14 * alpha;
  ctx.fillStyle = colors.primary;
  ctx.fill();
  ctx.globalAlpha = 0.9 * alpha;
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = Math.max(1.25, Math.min(w, h) * 0.02);
  ctx.stroke();
}

/** A green ring that grows and fades when the goal is reached. */
function drawSuccess(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  m: Moment,
  width: number,
) {
  if (m.atEnd <= 0 || m.atEnd >= 1.1) return;
  const t = m.atEnd / 1.1;
  ctx.globalAlpha = (1 - t) * 0.9 * m.fade;
  ctx.strokeStyle = GOAL;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, radius * (1 + 1.6 * smooth(t)), 0, Math.PI * 2);
  ctx.stroke();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  ep: GridEpisode,
  m: Moment,
  colors: Colors,
  area: Area,
) {
  const { W, H, frames, firstSeen } = ep;
  const cs = Math.max(4, Math.floor(Math.min(area.w / W, area.h / H)));
  const gw = cs * W;
  const gh = cs * H;
  const ox = Math.round(area.x + (area.w - gw) / 2);
  const oy = Math.round(area.y + (area.h - gh) / 2);
  const a = frames[m.i];
  const b = frames[Math.min(m.i + 1, ep.n - 1)];
  const cells = m.k > 0.5 ? b.cells : a.cells;

  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const c = y * W + x;
      const seen = firstSeen[c] < 0 ? 0 : clamp01(m.steps - firstSeen[c] + 1);
      const alpha = (seen + (1 - seen) * m.reveal * TRUTH_ALPHA) * m.fade;
      if (alpha > 0.003) drawCell(ctx, cells[c], ox + x * cs, oy + y * cs, cs, alpha, colors);
    }

  // Field of view, sliding with the agent.
  const [ax, ay] = fovOrigin(a.x, a.y, a.dir);
  const [bx, by] = fovOrigin(b.x, b.y, b.dir);
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, gw, gh);
  ctx.clip();
  drawView(
    ctx,
    ox + (ax + (bx - ax) * m.motion) * cs + 1,
    oy + (ay + (by - ay) * m.motion) * cs + 1,
    3 * cs - 2,
    3 * cs - 2,
    cs * 0.22,
    m.fade * (1 - 0.6 * m.reveal),
    colors,
  );
  ctx.restore();

  if (b.cells[b.y * W + b.x] === GOAL_CELL)
    drawSuccess(
      ctx,
      ox + (b.x + 0.5) * cs,
      oy + (b.y + 0.5) * cs,
      cs * 0.55,
      m,
      Math.max(1.5, cs * 0.07),
    );

  // The agent: a triangle pointing where it faces.
  const px = a.x + (b.x - a.x) * m.motion;
  const py = a.y + (b.y - a.y) * m.motion;
  let turn = b.dir - a.dir;
  if (turn > 2) turn -= 4;
  if (turn < -2) turn += 4;
  ctx.save();
  ctx.translate(ox + (px + 0.5) * cs, oy + (py + 0.5) * cs);
  ctx.rotate(((a.dir + turn * m.motion) * Math.PI) / 2);
  ctx.globalAlpha = m.fade;
  ctx.fillStyle = AGENT;
  ctx.beginPath();
  ctx.moveTo(cs * 0.34, 0);
  ctx.lineTo(-cs * 0.26, cs * 0.27);
  ctx.lineTo(-cs * 0.26, -cs * 0.27);
  ctx.closePath();
  ctx.fill();
  if (m.k > 0.5 ? b.carrying : a.carrying) {
    ctx.fillStyle = KEY;
    ctx.beginPath();
    ctx.arc(-cs * 0.04, 0, cs * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  cx: number,
  top: number,
  bs: number,
  label: number,
  alpha: number,
  colors: Colors,
) {
  const gap = Math.max(1, bs * 0.06);
  roundedRect(ctx, cx - bs / 2 + gap, top + gap, bs - 2 * gap, bs - 2 * gap, bs * 0.16);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colors.card;
  ctx.fill();
  ctx.globalAlpha = alpha * 0.16;
  ctx.fillStyle = colors.ink;
  ctx.fill();
  ctx.globalAlpha = alpha * 0.5;
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = Math.max(1, bs * 0.035);
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.92;
  ctx.fillStyle = colors.ink;
  ctx.font = `600 ${Math.round(bs * 0.42)}px ${colors.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(label), cx, top + bs / 2 + bs * 0.02);
}

function drawBlocks(
  ctx: CanvasRenderingContext2D,
  ep: BlocksEpisode,
  m: Moment,
  colors: Colors,
  area: Area,
) {
  const columns = ep.frames[0].stacks.length;
  const bs = Math.max(8, Math.floor(Math.min(area.w / (columns * 1.8), area.h / 9.4)));
  const colW = bs * 1.8;
  const ox = area.x + (area.w - columns * colW) / 2;
  const floor = Math.round(area.y + (area.h + 9 * bs) / 2 - 0.1 * bs);
  const gripY = floor - 8.1 * bs; // the gripper's bar
  const heldTop = gripY + 0.42 * bs;
  const colX = (c: number) => ox + (c + 0.5) * colW;
  const blockTop = (j: number) => floor - (j + 1) * bs;

  const a = ep.frames[m.i];
  const b = ep.frames[Math.min(m.i + 1, ep.n - 1)];
  const picking = a.held === 0 && b.held !== 0;
  const dropping = a.held !== 0 && b.held === 0;
  const gx = colX(a.pos) + (colX(b.pos) - colX(a.pos)) * m.motion;
  const stacks = picking ? b.stacks : dropping ? a.stacks : m.k > 0.5 ? b.stacks : a.stacks;

  // The target tower, drawn faintly on the left column.
  ep.target.forEach((column, c) =>
    column.forEach((label, j) => {
      const gap = Math.max(1, bs * 0.06);
      ctx.globalAlpha = 0.2 * m.fade;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1;
      roundedRect(
        ctx,
        colX(c) - bs / 2 + gap,
        blockTop(j) + gap,
        bs - 2 * gap,
        bs - 2 * gap,
        bs * 0.16,
      );
      ctx.stroke();
      ctx.globalAlpha = 0.2 * m.fade;
      ctx.fillStyle = colors.ink;
      ctx.font = `500 ${Math.round(bs * 0.36)}px ${colors.mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(label), colX(c), blockTop(j) + bs / 2);
    }),
  );

  // Floor under each column.
  for (let c = 0; c < columns; c++) {
    ctx.globalAlpha = 0.4 * m.fade;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = Math.max(1.5, bs * 0.05);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(colX(c) - colW * 0.4, floor + bs * 0.12);
    ctx.lineTo(colX(c) + colW * 0.4, floor + bs * 0.12);
    ctx.stroke();
  }

  // What the gripper sees: the column beneath it.
  drawView(
    ctx,
    gx - colW * 0.43,
    gripY + 0.22 * bs,
    colW * 0.86,
    floor - gripY - 0.02 * bs,
    bs * 0.3,
    m.fade,
    colors,
  );

  // Columns: their blocks once visited; until then, a dashed slot that says
  // nothing about what is inside.
  for (let c = 0; c < columns; c++) {
    const seen = ep.firstVisit[c] < 0 ? 0 : clamp01(m.steps - ep.firstVisit[c] + 1);
    const alpha = (seen + (1 - seen) * m.reveal * TRUTH_ALPHA) * m.fade;
    const unseen = 0.35 * (1 - seen) * (1 - m.reveal) * m.fade;
    if (unseen > 0.003) {
      ctx.globalAlpha = unseen;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1;
      ctx.setLineDash([Math.max(2, bs * 0.08), Math.max(2, bs * 0.08)]);
      roundedRect(ctx, colX(c) - bs / 2 + 1.5, floor - 6 * bs + 1.5, bs - 3, 6 * bs - 3, bs * 0.16);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (alpha > 0.003)
      stacks[c].forEach((label, j) =>
        drawBlock(ctx, colX(c), blockTop(j), bs, label, alpha, colors),
      );
  }

  // The block in the gripper, or on its way to or from a column.
  let moving: { label: number; x: number; top: number } | null = null;
  if (picking) {
    const from = blockTop(b.stacks[a.pos].length);
    moving = { label: b.held, x: gx, top: from + (heldTop - from) * m.motion };
  } else if (dropping) {
    const to = blockTop(b.stacks[b.pos].length - 1);
    moving = { label: a.held, x: gx, top: heldTop + (to - heldTop) * m.motion };
  } else if (a.held) moving = { label: a.held, x: gx, top: heldTop };
  if (moving) drawBlock(ctx, moving.x, moving.top, bs, moving.label, m.fade, colors);

  // The gripper.
  ctx.globalAlpha = m.fade;
  ctx.strokeStyle = AGENT;
  ctx.lineWidth = Math.max(2, bs * 0.11);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(gx, gripY - 0.9 * bs);
  ctx.lineTo(gx, gripY);
  ctx.moveTo(gx - 0.42 * bs, gripY + 0.36 * bs);
  ctx.lineTo(gx - 0.42 * bs, gripY);
  ctx.lineTo(gx + 0.42 * bs, gripY);
  ctx.lineTo(gx + 0.42 * bs, gripY + 0.36 * bs);
  ctx.stroke();

  // The tower is built.
  drawSuccess(ctx, colX(0), floor - 3 * bs, 3.1 * bs, m, Math.max(1.5, bs * 0.06));
}

function drawMine(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cs: number,
  alpha: number,
  colors: Colors,
) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colors.ink;
  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = Math.max(1, cs * 0.05);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, cs * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  for (let s = 0; s < 4; s++) {
    const angle = (s * Math.PI) / 4;
    ctx.moveTo(cx - Math.cos(angle) * cs * 0.26, cy - Math.sin(angle) * cs * 0.26);
    ctx.lineTo(cx + Math.cos(angle) * cs * 0.26, cy + Math.sin(angle) * cs * 0.26);
  }
  ctx.stroke();
}

function drawMines(
  ctx: CanvasRenderingContext2D,
  ep: MinesEpisode,
  m: Moment,
  colors: Colors,
  area: Area,
) {
  const { rows, cols } = ep;
  const cs = Math.max(8, Math.floor(Math.min(area.w / (cols + 1.6), area.h / (rows + 0.9))));
  const gw = cs * cols;
  const gh = cs * rows;
  const ox = Math.round(area.x + (area.w - gw) / 2);
  const oy = Math.round(area.y + (area.h - gh) / 2);
  const centre = (cell: number) => [
    ox + ((cell % cols) + 0.5) * cs,
    oy + (Math.floor(cell / cols) + 0.5) * cs,
  ];

  for (let cell = 0; cell < rows * cols; cell++) {
    const x = ox + (cell % cols) * cs;
    const y = oy + Math.floor(cell / cols) * cs;
    const at = ep.revealedAt[cell];
    const seen = at < 0 ? 0 : clamp01((m.steps - at + 1 - 0.6) / 0.4); // revealed once the click lands
    drawUnseen(ctx, x, y, cs, 0.4 * (1 - seen) * m.fade, colors);
    if (seen > 0) {
      const gap = Math.max(1, cs * 0.07);
      ctx.globalAlpha = seen * m.fade * 0.1;
      ctx.fillStyle = colors.ink;
      roundedRect(ctx, x + gap / 2, y + gap / 2, cs - gap, cs - gap, cs * 0.14);
      ctx.fill();
      if (ep.counts[cell]) {
        ctx.globalAlpha = seen * m.fade * 0.92;
        ctx.font = `600 ${Math.round(cs * 0.4)}px ${colors.mono}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(ep.counts[cell]), x + cs / 2, y + cs / 2 + cs * 0.02);
      }
    }
    if (ep.mines[cell] && m.reveal > 0) {
      const [cx, cy] = centre(cell);
      drawMine(ctx, cx, cy, cs, m.reveal * 0.8 * m.fade, colors);
    }
  }

  // The cell being clicked: what the agent sees this step.
  const from = ep.clicks[m.i];
  const to = ep.clicks[Math.min(m.i + 1, ep.n - 1)];
  const target = m.k > 0 ? to : from;
  if (target >= 0) {
    const [tx, ty] = centre(target);
    drawView(
      ctx,
      tx - cs / 2 + 1,
      ty - cs / 2 + 1,
      cs - 2,
      cs - 2,
      cs * 0.18,
      m.fade * (m.k > 0 ? m.motion : 1) * (1 - 0.6 * m.reveal),
      colors,
    );
  }

  // The agent's pointer moves from click to click.
  const [fx, fy] = from >= 0 ? centre(from) : [ox + gw / 2, oy + gh + cs * 0.4];
  const [px, py] = to >= 0 ? centre(to) : [fx, fy];
  const x = fx + (px - fx) * m.motion + cs * 0.08;
  const y = fy + (py - fy) * m.motion + cs * 0.08;
  ctx.globalAlpha = m.fade;
  ctx.fillStyle = AGENT;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + cs * 0.42);
  ctx.lineTo(x + cs * 0.11, y + cs * 0.31);
  ctx.lineTo(x + cs * 0.3, y + cs * 0.3);
  ctx.closePath();
  ctx.fill();

  // Board cleared.
  drawSuccess(ctx, ox + gw / 2, oy + gh / 2, Math.max(gw, gh) * 0.62, m, Math.max(1.5, cs * 0.05));
}

/** Draw one moment of an episode. Returns the caption to show next to the world's name. */
function drawEpisode(
  ctx: CanvasRenderingContext2D,
  ep: Episode,
  elapsed: number,
  colors: Colors,
  width: number,
  height: number,
): string {
  ctx.clearRect(0, 0, width, height);
  const m = momentOf(ep, elapsed);
  // Leave room for the label in the top-left corner.
  const labelSpace = 38;
  const pad = Math.max(14, Math.min(width, height) * 0.06);
  const area = { x: pad, y: labelSpace, w: width - 2 * pad, h: height - labelSpace - pad };
  if (ep.kind === "grid") drawGrid(ctx, ep, m, colors, area);
  else if (ep.kind === "blocks") drawBlocks(ctx, ep, m, colors, area);
  else drawMines(ctx, ep, m, colors, area);
  ctx.globalAlpha = 1;
  if (m.reveal <= 0.05) return SEEN;
  return ep.kind === "mines"
    ? "where the mines were"
    : ep.kind === "grid"
      ? "the true map"
      : "the true state";
}

export function GridworldCanvas({
  className,
  onLabel,
}: {
  className?: string;
  /** Called when the world changes, and when the true state is shown or hidden. */
  onLabel?: (world: string, caption: string) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef(onLabel);
  labelRef.current = onLabel;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const episodes = buildEpisodes();
    let colors = readColors();
    let index = 0;
    let elapsed = 0;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let onScreen = false;
    let lastLabel = "";

    const render = () => {
      if (!width || !height) return;
      const ep = episodes[index];
      const caption = drawEpisode(ctx, ep, elapsed, colors, width, height);
      const label = ep.world + "|" + caption;
      if (label !== lastLabel) {
        lastLabel = label;
        labelRef.current?.(ep.world, caption);
      }
    };

    // Reduced motion: the first run, finished, with what the agent saw.
    const drawStatic = () => {
      index = 0;
      const ep = episodes[0];
      elapsed = FADE_IN + (ep.n - 1) * ep.step + HOLD * 0.5;
      render();
    };

    const tick = (now: number) => {
      frame = 0;
      // `last` is 0 on the first frame after a pause: assume one 60 Hz frame.
      const dt = last ? Math.min(Math.max((now - last) / 1000, 0), 0.05) : 1 / 60;
      last = now;
      elapsed += dt;
      while (elapsed >= episodes[index].duration) {
        elapsed -= episodes[index].duration;
        index = (index + 1) % episodes.length;
      }
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
      if (reducedMotion.matches) drawStatic();
      else {
        render();
        schedule();
      }
    };

    const onMotionChange = () => {
      stop();
      width = 0;
      if (!reducedMotion.matches) elapsed = 0;
      resize();
    };

    const onVisibility = () => (document.hidden ? stop() : schedule());

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
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
