import type { ThemeId } from "@/data/themes";

/*
 * One small diagram per research theme. They are drawn with theme colours
 * (`--primary` for the model, `--signal` for the world or the next
 * observation), so they follow light and dark mode. All are decorative: the
 * text beside them carries the meaning.
 */

const VIEW = { w: 240, h: 128 };

/** Sample y = f(x) into an SVG path. */
function plot(f: (x: number) => number, from: number, to: number, step = 4) {
  let d = "";
  for (let x = from; x <= to; x += step) d += `${d ? "L" : "M"}${x} ${f(x).toFixed(1)}`;
  return d;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/**
 * Universal modelling: nested hypothesis spaces, each more expressive than
 * the last, until the space is large enough to contain the world (amber).
 */
function UniversalModelling() {
  const inner = [
    [58, 62],
    [72, 74],
    [66, 50],
    [84, 60],
  ];
  const middle = [
    [106, 44],
    [116, 78],
    [98, 92],
    [128, 58],
    [52, 92],
  ];
  const outer = [
    [150, 34],
    [166, 92],
    [142, 104],
    [196, 76],
    [176, 30],
  ];
  return (
    <Frame>
      <g stroke="var(--primary)" strokeWidth="1.2">
        <ellipse cx="118" cy="64" rx="104" ry="54" strokeOpacity="0.35" strokeDasharray="3 4" />
        <ellipse cx="94" cy="66" rx="66" ry="40" strokeOpacity="0.6" />
        <ellipse cx="72" cy="64" rx="30" ry="22" fill="var(--primary)" fillOpacity="0.08" />
      </g>
      <g fill="var(--primary)">
        {inner.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
        ))}
        {middle.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" fillOpacity="0.6" />
        ))}
        {outer.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fillOpacity="0.32" />
        ))}
      </g>
      <circle cx="188" cy="54" r="7.5" stroke="var(--signal)" strokeOpacity="0.45" />
      <circle cx="188" cy="54" r="3.2" fill="var(--signal)" />
    </Frame>
  );
}

/**
 * Model discovery: observations from interaction history, candidate models
 * that fail to explain them (dashed), and the one that is inferred (solid).
 */
function ModelDiscovery() {
  const model = (x: number) => 64 - 26 * Math.sin(((x - 24) / 196) * 2 * Math.PI * 0.85);
  const overfit = (x: number) => model(x) + 13 * Math.sin(x / 9);
  const line = (x: number) => 36 + (x - 24) * 0.27;
  const offsets = [-4, 3, -1, -5, 4, 2, -3, 3, -2, 4];
  const xs = [30, 52, 71, 93, 112, 134, 155, 178, 201, 214];
  return (
    <Frame>
      <g stroke="var(--foreground)" strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="3 4">
        <path d={plot(overfit, 24, 220)} />
        <path d={plot(line, 24, 220, 196)} />
      </g>
      <path
        d={plot(model, 24, 220)}
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.3">
        {xs.map((x, i) => (
          <circle key={x} cx={x} cy={model(x) + offsets[i]} r="2.6" />
        ))}
      </g>
    </Frame>
  );
}

/**
 * Active learning: uncertainty about the model is small near past
 * observations and large between them, so the next action (amber) probes
 * where the most information is to be gained.
 */
function ActiveLearning() {
  const observed = [28, 56, 84, 186, 212];
  const mean = (x: number) => 68 + 15 * Math.sin(x / 34 + 0.6);
  const spread = (x: number) => {
    const nearest = Math.min(...observed.map((o) => Math.abs(x - o)));
    return 2.5 + 27 * (1 - Math.exp(-((nearest / 36) ** 2)));
  };
  const upper = plot((x) => mean(x) - spread(x), 20, 220);
  let lower = "";
  for (let x = 220; x >= 20; x -= 4) lower += `L${x} ${(mean(x) + spread(x)).toFixed(1)}`;
  const query = 135;

  return (
    <Frame>
      <path d={`${upper}${lower}Z`} fill="var(--primary)" fillOpacity="0.12" />
      <path d={plot(mean, 20, 220)} stroke="var(--primary)" strokeWidth="1.6" />
      <line
        x1={query}
        x2={query}
        y1={mean(query) - spread(query)}
        y2={mean(query) + spread(query)}
        stroke="var(--signal)"
        strokeWidth="1.3"
        strokeDasharray="3 3"
      />
      <path
        d={`M${query} 118V${mean(query) + spread(query) + 8}m-4 5l4 -5l4 5`}
        stroke="var(--signal)"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={query} cy={mean(query)} r="3.4" fill="var(--signal)" />
      <g fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.3">
        {observed.map((x) => (
          <circle key={x} cx={x} cy={mean(x)} r="2.6" />
        ))}
      </g>
    </Frame>
  );
}

const illustrations: Record<ThemeId, () => React.JSX.Element> = {
  "universal-modelling": UniversalModelling,
  "model-discovery": ModelDiscovery,
  "active-learning": ActiveLearning,
};

export function ThemeIllustration({ id }: { id: ThemeId }) {
  const Illustration = illustrations[id];
  return <Illustration />;
}
