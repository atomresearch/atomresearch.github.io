// Group members, in the order they are listed on the members page.
export type Member = {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  bio: string;
  photo: string; // URL or imported image
  aliases?: string[]; // other spellings used in author lists ("Tim Z. Xiao")
  links: {
    website?: string;
    scholar?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
  group: "faculty" | "members" | "alumni";
};

const placeholder = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;

const membersRaw: Member[] = [
  {
    id: "vsix",
    name: "Valentin Six",
    role: "Research Intern",
    affiliation: "MPI-IS",
    bio: "Large Language Models and World Models",
    photo: placeholder("vsix"),
    links: {
      website: "https://valentinsix.github.io/",
      scholar: "https://scholar.google.com/citations?user=bDJt-yIAAAAJ",
      github: "https://github.com/valentinsix",
    },
    group: "members",
  },
  {
    id: "fpanse",
    name: "Frederik Panse",
    role: "Research Intern",
    affiliation: "University of Tübingen · MPI-IS",
    bio: "Bayesian ML, Cognitive Modeling, and Causality",
    photo: placeholder("fpanse"),
    links: {
      website: "https://www.linkedin.com/in/frederik-panse-199a42262/",
      github: "https://github.com/frederikpanse",
    },
    group: "alumni",
  },
  {
    id: "mfajeau",
    name: "Mathis Fajeau",
    role: "Research Collaborator",
    affiliation: "MPI-IS",
    bio: "World Models, Custom Cuda Kernels and High Performance Computing",
    photo: placeholder("mfajeau"),
    links: {
      website: "https://mtsfj.github.io/",
      github: "https://github.com/mtsfj",
    },
    group: "members",
  },

  {
    id: "ldc",
    name: "Lancelot Da Costa",
    role: "Lead, ATOM Research",
    affiliation: "Postdoc, Empirical Inference, MPI-IS",
    bio: "Bayesian machine learning, world models, and active inference. Previously at ICL and VERSES.",
    photo: placeholder("ldc"),
    links: {
      website: "https://www.lancelotdacosta.com/home",
      scholar: "https://scholar.google.com/citations?user=PCHqHCsAAAAJ&hl=en",
      twitter: "https://x.com/lancelotdacosta",
      github: "https://github.com/lancelotdacosta",
    },
    group: "members",
  },
  {
    id: "msharma",
    name: "Mridul Sharma",
    role: "Research Collaborator",
    affiliation: "IRIIS",
    bio: "Language Models, VLA models, Reinforcement Learning",
    photo: placeholder("msharma"),
    links: {
      website: "https://mridul3301.github.io/",
      scholar: "https://scholar.google.com/citations?user=TSC8VqkAAAAJ&hl=en",
    },
    group: "members",
  },
  {
    id: "aamayuelas",
    name: "Alfonso Amayuelas",
    role: "PhD Candidate",
    affiliation: "UC Santa Barbara",
    bio: "LLM Capabilities, Agent Based Systems, and Application of LLMs",
    photo: placeholder("aamayelas"),
    links: {
      website: "https://www.amayuelas.me/",
      scholar: "https://scholar.google.com/citations?user=QGQ2G28AAAAJ&hl=en",
    },
    group: "alumni",
  },
  {
    id: "txiao",
    name: "Tim Xiao",
    aliases: ["Tim Z. Xiao"],
    role: "PhD Candidate",
    affiliation: "University of Tübingen · MPI-IS",
    bio: "Causality, Large Language Models, and World Models",
    photo: placeholder("txiao"),
    links: {
      website: "http://timx.me",
      scholar: "https://scholar.google.com/citations?user=4I7boHIAAAAJ&hl=en",
    },
    group: "alumni",
  },
  {
    id: "apashea",
    name: "Andrew Pashea",
    role: "Research Engineer",
    affiliation: "Active Inference Institute",
    bio: "Active inference and hierarchical world models.",
    photo: placeholder("apashea"),
    links: {},
    group: "members",
  },
  {
    id: "dhyland",
    name: "David Hyland",
    role: "Postdoc",
    affiliation: "University of Oxford",
    bio: "Game theory, Bounded rationality, collective intelligence, and models of human cognition",
    photo: placeholder("dhyland"),
    links: {
      website: "https://www.cs.ox.ac.uk/people/david.hyland/",
      scholar: "https://scholar.google.com/citations?user=izVwRKkAAAAJ&hl=en",
    },
    group: "members",
  },
  {
    id: "tsalvatori",
    name: "Tommaso Salvatori",
    role: "Project Lead",
    affiliation: "Co-founder, Relational Intelligence",
    bio: "Predictive coding, active inference, and structure learning",
    photo: placeholder("tsalvatori"),
    links: {},
    group: "members",
  },
  {
    id: "apawar",
    name: "Aman Pawar",
    role: "Project Lead",
    affiliation: "PhD researcher, MPI Magdeburg",
    bio: "Scientific machine learning and principled hierarchies",
    photo: placeholder("apawar"),
    links: {
      website: "https://www.linkedin.com/in/amanpawar1/",
    },
    group: "members",
  },
  {
    id: "kzaghw",
    name: "Karim Zaghw",
    role: "Research Collaborator",
    affiliation: "University of Tübingen",
    bio: "Renormalising generative models and active inference",
    photo: placeholder("kzaghw"),
    links: {},
    group: "members",
  },
  {
    id: "mpritsch",
    name: "Marc Pritsch",
    role: "Research Collaborator",
    affiliation: "Heidelberg University",
    bio: "Renormalising generative models and active inference",
    photo: placeholder("mpritsch"),
    links: {},
    group: "members",
  },
  {
    id: "wnuijten",
    name: "Wouter Nuijten",
    role: "PhD Candidate",
    affiliation: "TU Eindhoven · Lazy Dynamics",
    bio: "Active inference as variational inference, message passing, and probabilistic programming",
    photo: placeholder("wnuijten"),
    links: {
      website: "https://wouterwln.github.io/",
    },
    group: "members",
  },
  {
    id: "jlee",
    name: "Jeongjun Lee",
    role: "Research Collaborator",
    affiliation: "GIST",
    bio: "Theoretical active inference and how intelligence can emerge",
    photo: placeholder("jlee"),
    links: {},
    group: "members",
  },
  {
    id: "msamiei",
    name: "Manoosh Samiei",
    role: "Research Collaborator",
    affiliation: "Mila",
    bio: "Principled hierarchies",
    photo: placeholder("msamiei"),
    links: {
      website: "https://manooshsamiei.github.io/",
    },
    group: "members",
  },
  {
    id: "agholamzadeh",
    name: "Ali Gholamzadeh",
    role: "Research Collaborator",
    affiliation: "MPI-IS",
    bio: "Principled hierarchies",
    photo: placeholder("agholamzadeh"),
    links: {},
    group: "members",
  },
  {
    id: "mlbath",
    name: "Mounir Lbath",
    role: "Research Collaborator",
    affiliation: "École Polytechnique",
    bio: "LLM state-space discovery",
    photo: placeholder("mlbath"),
    links: {},
    group: "members",
  },
  {
    id: "abelfatmi",
    name: "Ayoub Belfatmi",
    role: "Research Collaborator",
    affiliation: "École Polytechnique",
    bio: "LLM state-space discovery",
    photo: placeholder("abelfatmi"),
    links: {},
    group: "members",
  },
  {
    id: "maansari",
    name: "Mohammed Abbas Ansari",
    role: "Research Collaborator",
    affiliation: "University of Tübingen",
    bio: "Computational neuroscience and natural building blocks for world models",
    photo: placeholder("maansari"),
    links: {
      website: "https://m-abbas-ansari.github.io/",
    },
    group: "alumni",
  },
  // In their one-month probation (joined about 23 Nov 2026): listed from about 23 Dec, if still active.
  //   {
  //     id: "afarajidizaji",
  //     name: "Asma Farajidizaji",
  //     role: "Research Collaborator",
  //     affiliation: "",
  //     bio: "Benchmarking ATOM agents",
  //     photo: placeholder("afarajidizaji"),
  //     links: {},
  //     group: "members",
  //   },
  //   {
  //     id: "lmorlok",
  //     name: "Luca Morlok",
  //     role: "Research Collaborator",
  //     affiliation: "",
  //     bio: "LLM structure learning",
  //     photo: placeholder("lmorlok"),
  //     links: {},
  //     group: "members",
  //   },
];

// Portraits live in `src/assets/members`, named after the member id
// (`ldc.webp`, `vsix.jpg`, ...). They are shown at 80 to 192 px, so a square
// image of about 400 px is plenty: larger files only slow the page down.
const images = import.meta.glob("../assets/members/*.{webp,avif,png,jpg,jpeg,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const imageMap = Object.fromEntries(
  Object.entries(images).map(([path, url]) => {
    const file = path.split("/").pop()!;
    return [file.substring(0, file.lastIndexOf(".")), url];
  }),
);

// Without a photo of their own, a member gets a colourful generated avatar
// (`placeholder` above: DiceBear "glass", seeded by their id).
export const hasOwnPhoto = (m: Member) => m.id in imageMap;

export const members: Member[] = membersRaw.map((m) => ({
  ...m,
  photo: imageMap[m.id] ?? placeholder(m.id),
}));

export const getMember = (id: string) => members.find((m) => m.id === id);

/** The member an author name refers to, if any. */
export const memberByName = (name: string) =>
  members.find((m) => m.name === name || m.aliases?.includes(name));
