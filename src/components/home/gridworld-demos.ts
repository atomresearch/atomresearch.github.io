/*
 * Demonstrations for the hero animation (gridworld-canvas.tsx).
 *
 * A subset of the released Pinductor demonstrations, as embedded by Mathis
 * Fajeau in https://mtsfj.github.io/articles/pinductor.html. Every run below
 * reaches its goal.
 *
 * Gridworlds (MiniGrid): '#' wall, '.' empty, '~' lava, 'G' goal, 'K' key,
 * 'L' locked door; pos = [x, y]; dir 0 right, 1 down, 2 left, 3 up; actions
 * 0 left, 1 right, 2 forward, 3 pick up, 4 drop, 5 toggle.
 * Blocks World: stacks bottom to top over three columns; the gripper starts
 * at column `pos`; actions 0 left, 1 right, 2 pick, 3 drop.
 * MineSweeper (PopGym): `mines` is the board row by row (1 = mine); each
 * action clicks one cell and observes the number of adjacent mines.
 */

export type GridDemo = { grid: string[]; pos: [number, number]; dir: number; actions: number[] };
export type BlocksDemo = { stacks: number[][]; pos: number; target: number[][]; actions: number[] };
export type MinesDemo = { dims: [number, number]; mines: number[]; actions: number[] };
export type DemoWorld =
  | { kind: "grid"; name: string; demos: GridDemo[] }
  | { kind: "blocks"; name: string; demos: BlocksDemo[] }
  | { kind: "mines"; name: string; demos: MinesDemo[] };

export const DEMO_WORLDS: DemoWorld[] = [
  {
    kind: "grid",
    name: "Four Rooms",
    demos: [
      {
        grid: [
          "###############",
          "#......#......#",
          "#......#......#",
          "#.............#",
          "#......#......#",
          "#......#......#",
          "#......#......#",
          "###.######.####",
          "#......#......#",
          "#......#......#",
          "#.........G...#",
          "#......#......#",
          "#......#......#",
          "#......#......#",
          "###############",
        ],
        pos: [1, 1],
        dir: 0,
        actions: [
          2, 2, 2, 1, 2, 2, 4, 0, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 0, 2,
          1, 2, 2, 2, 2,
        ],
      },
      {
        grid: [
          "###############",
          "#......#......#",
          "#......#......#",
          "#.............#",
          "#......#......#",
          "#......#......#",
          "#......#......#",
          "###.######.####",
          "#......#......#",
          "#......#......#",
          "#.............#",
          "#......#......#",
          "#......#.....G#",
          "#......#......#",
          "###############",
        ],
        pos: [1, 1],
        dir: 0,
        actions: [
          2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 1, 2, 2, 4, 0, 2, 2, 2, 1, 2, 2, 0, 2, 2, 2, 2, 2,
        ],
      },
      {
        grid: [
          "###############",
          "#......#......#",
          "#......#......#",
          "#.............#",
          "#......#......#",
          "#......#......#",
          "#......#......#",
          "###.######.####",
          "#......#......#",
          "#......#......#",
          "#.............#",
          "#......#.G....#",
          "#......#......#",
          "#......#......#",
          "###############",
        ],
        pos: [1, 1],
        dir: 0,
        actions: [
          1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 0,
          2, 2, 2,
        ],
      },
    ],
  },
  {
    kind: "blocks",
    name: "Blocks World",
    demos: [
      {
        stacks: [
          [2, 5],
          [6, 1],
          [3, 4],
        ],
        pos: 1,
        target: [[1, 2, 3, 4, 5, 6], [], []],
        actions: [
          2, 1, 3, 0, 0, 2, 1, 3, 0, 2, 1, 3, 1, 2, 0, 0, 3, 1, 2, 0, 3, 1, 1, 2, 0, 3, 1, 2, 0, 0,
          3, 1, 2, 0, 3, 1, 2, 0, 3, 1, 2, 0, 3,
        ],
      },
      {
        stacks: [[1, 5], [3], [6, 2, 4]],
        pos: 0,
        target: [[1, 2, 3, 4, 5, 6], [], []],
        actions: [
          1, 1, 2, 0, 3, 0, 2, 1, 3, 1, 2, 0, 0, 3, 1, 2, 1, 3, 0, 2, 1, 3, 0, 2, 0, 3, 1, 1, 2, 0,
          0, 3, 1, 1, 2, 0, 0, 3, 1, 1, 2, 0, 0, 3,
        ],
      },
      {
        stacks: [[3], [6, 2], [5, 1, 4]],
        pos: 2,
        target: [[1, 2, 3, 4, 5, 6], [], []],
        actions: [
          0, 0, 2, 1, 3, 1, 2, 0, 3, 1, 2, 0, 0, 3, 1, 2, 1, 3, 0, 2, 1, 3, 0, 2, 0, 3, 1, 1, 2, 0,
          0, 3, 1, 1, 2, 0, 0, 3, 1, 1, 2, 0, 0, 3, 1, 2, 0, 3,
        ],
      },
    ],
  },
  {
    kind: "grid",
    name: "Unlock",
    demos: [
      {
        grid: [
          "###########",
          "#....#....#",
          "#....#....#",
          "#..K.L..G.#",
          "#....#....#",
          "###########",
        ],
        pos: [4, 4],
        dir: 1,
        actions: [1, 1, 2, 1, 1, 1, 5, 3, 1, 1, 2, 5, 2, 2, 2, 2],
      },
      {
        grid: [
          "###########",
          "#...K#....#",
          "#....#....#",
          "#....L..G.#",
          "#....#....#",
          "###########",
        ],
        pos: [2, 1],
        dir: 2,
        actions: [2, 1, 1, 2, 2, 5, 3, 1, 2, 2, 4, 4, 3, 1, 1, 1, 2, 2, 2, 5, 2, 2, 2, 2],
      },
      {
        grid: [
          "###########",
          "#....#....#",
          "#....#....#",
          "#....L..G.#",
          "#K...#....#",
          "###########",
        ],
        pos: [2, 1],
        dir: 3,
        actions: [
          1, 1, 1, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 1, 2, 0, 0, 0, 3, 0, 0, 0, 2, 1, 2, 2, 5, 2, 2, 2,
          2,
        ],
      },
    ],
  },
  {
    kind: "mines",
    name: "MineSweeper",
    demos: [
      {
        dims: [4, 4],
        mines: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
        actions: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15],
      },
      {
        dims: [4, 4],
        mines: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        actions: [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      },
      {
        dims: [4, 4],
        mines: [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        actions: [0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15],
      },
    ],
  },
];
