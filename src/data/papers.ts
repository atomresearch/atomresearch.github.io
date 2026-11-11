import pipelineDark from "@/assets/papers/pinductor/pipeline-dark.svg";
import pipelineLight from "@/assets/papers/pinductor/pipeline-light.svg";
import mainResults from "@/assets/papers/pinductor/main-results.svg";

// Publications shown on the research page, newest first.
//
// Optional fields:
//   shortName   short name of the method, shown next to the title
//   summary     two or three sentences for the home page
//   featured    show this paper in the "Featured publication" block of the
//               home page (the most recent featured paper wins)
//   figure      overview figure, in a light and a dark version
//   results     results figure shown with the paper on the research page
//   links.blog  slug of the blog post about the paper
//
// Authors who are members (by name, or by one of the `aliases` in
// members.ts) are highlighted.
export type PaperFigure = {
  light: string;
  dark?: string; // falls back to `light`, shown on a white panel
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type Paper = {
  id: string;
  title: string;
  shortName?: string;
  authors: string[];
  venue: string;
  year: number;
  date: string; // ISO publication date — used for sorting
  abstract: string;
  summary?: string;
  featured?: boolean;
  figure?: PaperFigure;
  results?: PaperFigure;
  tags: string[];
  links: {
    pdf?: string;
    arxiv?: string;
    code?: string;
    project?: string;
    explainer?: string;
    blog?: string;
  };
  bibtex: string;
};

export const papers: Paper[] = [
  {
    id: "atom-2025",
    title: "Learning POMDP World Models from Observations with Language-Model Priors",
    shortName: "Pinductor",
    featured: true,
    summary:
      "Pinductor (POMDP-inductor) induces executable world models from just a handful of observation-action trajectories. An LLM proposes the POMDP components as code, and a particle filter scores each candidate against the observations alone, with zero access to hidden states.",
    figure: {
      light: pipelineLight,
      dark: pipelineDark,
      alt: "The Pinductor pipeline: a replay buffer of state-free trajectories and model templates prompt an LLM to propose POMDP components; a particle filter scores them against observations and feeds refinement back; the selected model drives a POMDP solver in the environment, and episodes return to the buffer.",
      caption: "The Pinductor pipeline, as in the paper.",
      width: 1200,
      height: 700,
    },
    results: {
      light: mainResults,
      alt: "Main task performance: mean return of Pinductor and the baselines on five MiniGrid environments, Block and MineSweeper, with 95% intervals for Pinductor and POMDP Coder and the optimal reference dashed.",
      caption:
        "Main task performance: mean return of Pinductor and the baselines on five MiniGrid environments, Block and MineSweeper.",
      width: 1030,
      height: 658,
    },
    authors: [
      "Valentin Six",
      "Frederik Panse",
      "Mathis Fajeau",
      "Lancelot Da Costa",
      "Mridul Sharma",
      "Alfonso Amayuelas",
      "Tim Z. Xiao",
      "David Hyland",
      "Philipp Hennig",
      "Bernhard Schölkopf",
    ],
    venue: "NeurIPS",
    year: 2026,
    date: "2026-05-14",
    abstract:
      "Whether navigating a building, operating a robot, or playing a game, an agent that acts effectively in an environment must first learn an internal model of how that environment works. Partially-observable Markov decision processes (POMDPs) provide a flexible modeling class for such internal world models, but learning them from observation-action trajectories alone is challenging and typically requires extensive environment interaction. We ask whether language-model priors can reduce costly interaction by leveraging prior knowledge, and introduce Pinductor (POMDP-inductor): an LLM proposes candidate POMDP models from a few observation-action trajectories and iteratively refines them to optimize a belief-based likelihood score. Despite relying on strictly less information, Pinductor achieves comparable performance and sample efficiency to LLM-based POMDP learning methods with privileged access to hidden states. Moreover, it is up to 330 times more sample-efficient than standard POMDP baselines such as DreamerV3, at comparable computational cost. Further results show that performance scales with LLM capability and degrades gracefully as semantic information about the environment is withheld. Together, these results position language-model priors as a practical tool for sample-efficient world-model learning under partial observability, and a step toward generalist agents in real-world environments.",
    tags: ["Agent Foundation Model", "Active Learning", "World Models"],
    links: {
      arxiv: "https://arxiv.org/abs/2605.13740",
      code: "https://github.com/atomresearch/pinductor",
      explainer: "https://mtsfj.github.io/articles/pinductor.html",
      blog: "pinductor",
    },
    bibtex: `@inproceedings{six2026pinductor,
      title={Pinductor: Learning {POMDP} World Models from Observations with Language-Model Priors},
      author={Valentin Six and Frederik Panse and Mathis Fajeau and Lancelot Da Costa and Mridul Sharma and Alfonso Amayuelas and Tim Z. Xiao and David Hyland and Philipp Hennig and Bernhard Sch{\\"o}lkopf},
      booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
      year={2026},
      note={arXiv:2605.13740}
    }`,
  },
  // {
  //   id: "ppi-2025",
  //   title: "Probabilistic Program Induction with Amortized Variational Search",
  //   authors: ["S. Mehta", "J. Yamamoto", "A. Rivera"],
  //   venue: "NeurIPS 2025",
  //   year: 2025,
  //   date: "2025-12-08",
  //   abstract:
  //     "An amortized inference framework that discovers compact probabilistic programs explaining sequential observations, enabling fast structure learning over symbolic hypotheses.",
  //   tags: ["Program Induction", "Variational Inference", "Structure Learning"],
  //   links: { arxiv: "https://arxiv.org/abs/0000.00001", pdf: "#" },
  //   bibtex: `@inproceedings{mehta2025ppi,\n  title={Probabilistic Program Induction with Amortized Variational Search},\n  author={Mehta, S. and Yamamoto, J. and Rivera, A.},\n  booktitle={NeurIPS},\n  year={2025}\n}`,
  // },
  // {
  //   id: "causal-mbrl-2024",
  //   title: "Causal Representations for Sample-Efficient Model-Based RL",
  //   authors: ["L. Okafor", "K. Tanaka", "M. Bauer"],
  //   venue: "ICML 2024",
  //   year: 2024,
  //   date: "2024-07-21",
  //   abstract:
  //     "We learn disentangled causal latent variables that admit interventional reasoning, dramatically improving generalization in model-based reinforcement learning.",
  //   tags: ["Causal Representation", "Model-Based RL"],
  //   links: { arxiv: "https://arxiv.org/abs/0000.00002", code: "https://github.com/" },
  //   bibtex: `@inproceedings{okafor2024causal,\n  title={Causal Representations for Sample-Efficient Model-Based RL},\n  author={Okafor, L. and Tanaka, K. and Bauer, M.},\n  booktitle={ICML},\n  year={2024}\n}`,
  // },
  // {
  //   id: "exploration-2024",
  //   title: "Information-Theoretic Exploration via Epistemic World Models",
  //   authors: ["K. Tanaka", "A. Rivera"],
  //   venue: "ICLR 2024",
  //   year: 2024,
  //   date: "2024-05-07",
  //   abstract:
  //     "We derive a tractable epistemic uncertainty estimator for world models and show it produces directed exploration that surpasses prior intrinsic motivation methods.",
  //   tags: ["Active Learning", "Exploration", "Uncertainty"],
  //   links: { arxiv: "https://arxiv.org/abs/0000.00003" },
  //   bibtex: `@inproceedings{tanaka2024exploration,\n  title={Information-Theoretic Exploration via Epistemic World Models},\n  author={Tanaka, K. and Rivera, A.},\n  booktitle={ICLR},\n  year={2024}\n}`,
  // },
];
