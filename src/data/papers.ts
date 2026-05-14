// Replace this list with real publications.
// Schema: id, title, authors[], venue, year, abstract, tags[], links{ pdf?, arxiv?, code?, project? }, bibtex
export type Paper = {
  id: string;
  title: string;
  authors: string[];
  groupAuthors?: string[]; // names from members.ts to highlight
  venue: string;
  year: number;
  date: string; // ISO publication date — used for sorting
  abstract: string;
  tags: string[];
  links: { pdf?: string; arxiv?: string; code?: string; project?: string };
  bibtex: string;
};

export const papers: Paper[] = [
  {
    id: "atom-2025",
    title: "Learning POMDP World Models from Observations with Language-Model Priors",
    authors: ["V. Six", "F. Panse", "M. Fajeau", "L. D. Costa", "M. Sharma", "A. amayuelas", "T. Z. Xiao", "D. Hyland", "P. Hennig", "B. Scholkopf"],
    groupAuthors: ["V. Six", "F. Panse", "M. Fajeau", "L. D. Costa", "M. Sharma", "A. amayuelas", "T. Z. Xiao", "D. Hyland"],
    venue: "arXiv preprint",
    year: 2025,
    date: "2025-09-12",
    abstract:
      "We propose ATOM, a generalist agent that learns probabilistic world models through active exploration and self-directed experimentation, achieving extreme sample efficiency across procedurally generated environments.",
    tags: ["Agent Foundation Model", "Active Learning", "World Models"],
    links: { arxiv: "https://arxiv.org/abs/2605.13740", code: "https://github.com/atomresearch/pinductor" },
    bibtex: `@misc{six2026learningpomdpworldmodels,
      title={Learning POMDP World Models from Observations with Language-Model Priors}, 
      author={Valentin Six and Frederik Panse and Mathis Fajeau and Lancelot Da Costa and Mridul Sharma and Alfonso Amayuelas and Tim Z. Xiao and David Hyland and Philipp Hennig and Bernhard Schölkopf},
      year={2026},
      eprint={2605.13740},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2605.13740}, 
      }`,
  },
  // {
  //   id: "ppi-2025",
  //   title: "Probabilistic Program Induction with Amortized Variational Search",
  //   authors: ["S. Mehta", "J. Yamamoto", "A. Rivera"],
  //   groupAuthors: ["S. Mehta", "A. Rivera"],
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
  //   groupAuthors: ["L. Okafor", "K. Tanaka"],
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
  //   groupAuthors: ["K. Tanaka", "A. Rivera"],
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
