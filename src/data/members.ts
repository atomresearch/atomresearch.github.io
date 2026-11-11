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
  group: "faculty" | "members";
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
      email: "six.valentin@gmail.com",
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
      email: "frederik.panse@gmail.com",
    },
    group: "members",
  },
  {
    id: "mfajeau",
    name: "Mathis Fajeau",
    role: "Research Collaborator",
    affiliation: "MPI-IS",
    bio: "World Models, Custom Cuda Kernels and High Performance Computing",
    photo: placeholder("mfajeau"),
    links: {
      website: "https://www.linkedin.com/in/mathis-fajeau/",
      github: "https://github.com/ZWhimsi",
      email: "fajeaumathis8@gmail.com",
    },
    group: "members",
  },

  {
    id: "ldc",
    name: "Lancelot Da Costa",
    role: "Postdoc | Principal Investigator",
    affiliation: "ATOM Research Group · MPI-IS",
    bio: "Bayesian machine learning, world models, and active inference. Previously at ICL and VERSES.",
    photo: placeholder("ldc"),
    links: {
      website: "https://www.lancelotdacosta.com/home",
      scholar: "https://scholar.google.com/citations?user=PCHqHCsAAAAJ&hl=en",
      twitter: "https://x.com/lancelotdacosta",
      github: "https://github.com/lancelotdacosta",
      email: "lancelot.dacosta@gmail.com",
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
      email: "mridulsharma3301@gmail.com",
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
      email: "amayuelas@ucsb.edu",
    },
    group: "members",
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
      email: "xiaozhenzhong0708@gmail.com",
    },
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
      email: "davidh7057@gmail.com",
    },
    group: "members",
  },
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

export const members: Member[] = membersRaw.map((m) => ({
  ...m,
  photo: imageMap[m.id] ?? m.photo,
}));

export const getMember = (id: string) => members.find((m) => m.id === id);

/** The member an author name refers to, if any. */
export const memberByName = (name: string) =>
  members.find((m) => m.name === name || m.aliases?.includes(name));
