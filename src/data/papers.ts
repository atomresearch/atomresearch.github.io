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
// Each paper gets its own page at /research/<id>/. Authors who are members
// (by name, or by one of the `aliases` in members.ts) are highlighted and
// linked to their profile.
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
    id: "pinductor",
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
    tags: ["Model discovery", "Active Learning", "World Models"],
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
  {
    id: "rgm-active-inference",
    title:
      "Renormalising Generative Models for Active Inference: Foundations, Derivations, and Verification",
    authors: [
      "Karim Zaghw",
      "Andrew Pashea",
      "Marc Pritsch",
      "Wouter Nuijten",
      "Karl Friston",
      "Lancelot Da Costa",
    ],
    venue: "arXiv preprint",
    year: 2026,
    date: "2026-08-10",
    abstract:
      "Active inference offers a unified framework for perception, learning, and action, but scaling discrete active-inference models to rich spatial and temporal domains remains difficult. Renormalising generative models (RGMs) address this challenge by composing discrete generative models across spatial and temporal scales, coarse-graining lower-level states and paths into higher-level causes for objects, events, and action. However, fully reproducing and adapting the framework remains difficult: the mathematical exposition is compact, and the reference implementations are deeply integrated within specialized software environments, leaving many algorithmic details implicit. This paper addresses these challenges by providing a self-contained, derivation-oriented account of RGMs together with an open, verified implementation. We explain how the hierarchy is built, how beliefs and actions are updated within it, and how information is passed between levels. Where the published equations and implementation differ in emphasis, we make those choices explicit and explain their modelling consequences. By clarifying the theory and separating it from its original implementation context, this work lowers practical barriers to entry and makes RGMs more transparent, auditable, and reproducible, providing a foundation for future quantitative evaluation and development on machine-learning benchmarks.",
    tags: ["Active Inference", "Hierarchical Models", "Generative Models"],
    links: {
      arxiv: "https://arxiv.org/abs/2608.09512",
      code: "https://github.com/atomresearch/RGMs",
    },
    bibtex: `@misc{zaghw2026renormalising,
      title={Renormalising Generative Models for Active Inference: Foundations, Derivations, and Verification},
      author={Karim Zaghw and Andrew Pashea and Marc Pritsch and Wouter Nuijten and Karl Friston and Lancelot Da Costa},
      year={2026},
      eprint={2608.09512},
      archivePrefix={arXiv},
      primaryClass={cs.AI}
    }`,
  },
  {
    id: "natural-building-blocks",
    title: "Natural Building Blocks for Structured World Models: Theory, Evidence, and Scaling",
    authors: ["Lancelot Da Costa", "Sanjeev Namjoshi", "Mohammed Abbas Ansari", "Bernhard Schölkopf"],
    venue: "World Modeling Workshop",
    year: 2026,
    date: "2025-11-03",
    abstract:
      "The field of world modeling is fragmented, with researchers developing bespoke architectures that rarely build upon each other. We propose a framework that specifies the natural building blocks for structured world models based on the fundamental stochastic processes that any world model must capture: discrete processes (logic, symbols) and continuous processes (physics, dynamics); the world model is then defined by the hierarchical composition of these building blocks. We examine Hidden Markov Models (HMMs) and switching linear dynamical systems (sLDS) as natural building blocks for discrete and continuous modeling--which become partially-observable Markov decision processes (POMDPs) and controlled sLDS when augmented with actions. This modular approach supports both passive modeling (generation, forecasting) and active control (planning, decision-making) within the same architecture. We avoid the combinatorial explosion of traditional structure learning by largely fixing the causal architecture and searching over only four depth parameters. We review practical expressiveness through multimodal generative modeling (passive) and planning from pixels (active), with performance competitive to neural approaches while maintaining interpretability. The core outstanding challenge is scalable joint structure-parameter learning; current methods finesse this by cleverly growing structure and parameters incrementally, but are limited in their scalability. If solved, these natural building blocks could provide foundational infrastructure for world modeling, analogous to how standardized layers enabled progress in deep learning.",
    tags: ["World Models", "Structure Learning", "Hierarchical Models"],
    links: {
      arxiv: "https://arxiv.org/abs/2511.02091",
    },
    bibtex: `@misc{dacosta2025natural,
      title={Natural Building Blocks for Structured World Models: Theory, Evidence, and Scaling},
      author={Lancelot Da Costa and Sanjeev Namjoshi and Mohammed Abbas Ansari and Bernhard Sch{\\"o}lkopf},
      year={2025},
      eprint={2511.02091},
      archivePrefix={arXiv},
      primaryClass={cs.AI}
    }`,
  },
  {
    id: "possible-principles",
    title: "Possible Principles for Aligned Structure Learning Agents",
    authors: [
      "Lancelot Da Costa",
      "Tomáš Gavenčiak",
      "David Hyland",
      "Mandana Samiei",
      "Cristian Dragos-Manta",
      "Candice Pattisapu",
      "Adeel Razi",
      "Karl Friston",
    ],
    venue: "Neural Computation",
    year: 2025,
    date: "2024-09-30",
    abstract:
      "This paper offers a roadmap for the development of scalable aligned artificial intelligence (AI) from first principle descriptions of natural intelligence. In brief, a possible path toward scalable aligned AI rests upon enabling artificial agents to learn a good model of the world that includes a good model of our preferences. For this, the main objective is creating agents that learn to represent the world and other agents' world models; a problem that falls under structure learning (a.k.a. causal representation learning). We expose the structure learning and alignment problems with this goal in mind, as well as principles to guide us forward, synthesizing various ideas across mathematics, statistics, and cognitive science. 1) We discuss the essential role of core knowledge, information geometry and model reduction in structure learning, and suggest core structural modules to learn a wide range of naturalistic worlds. 2) We outline a way toward aligned agents through structure learning and theory of mind. As an illustrative example, we mathematically sketch Asimov's Laws of Robotics, which prescribe agents to act cautiously to minimize the ill-being of other agents. We supplement this example by proposing refined approaches to alignment. These observations may guide the development of artificial intelligence in helping to scale existing -- or design new -- aligned structure learning systems.",
    tags: ["Structure Learning", "Alignment", "Active Inference"],
    links: {
      arxiv: "https://arxiv.org/abs/2410.00258",
    },
    bibtex: `@article{dacosta2025possible,
      title={Possible Principles for Aligned Structure Learning Agents},
      author={Lancelot Da Costa and Tom{\\'a}{\\v{s}} Gaven{\\v{c}}iak and David Hyland and Mandana Samiei and Cristian Dragos-Manta and Candice Pattisapu and Adeel Razi and Karl Friston},
      journal={Neural Computation},
      year={2025},
      note={arXiv:2410.00258}
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
