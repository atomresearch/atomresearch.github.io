// The group's three research themes, shown on the home and research pages.
// Each `id` has a matching illustration in
// `src/components/site/theme-illustrations.tsx`.
export type ThemeId = "universal-modelling" | "model-discovery" | "active-learning";

export type ResearchTheme = {
  id: ThemeId;
  title: string;
  desc: string;
};

export const themes: ResearchTheme[] = [
  {
    id: "universal-modelling",
    title: "Universal modelling",
    desc: "Developing an increasingly expressive hypothesis space, enabling the agent to model anything from physical to social interactions.",
  },
  {
    id: "model-discovery",
    title: "Model discovery",
    desc: "Inferring plausible models based on agent–environment interaction history, online, and under suitable priors (cf. compression & core knowledge).",
  },
  {
    id: "active-learning",
    title: "Active learning",
    desc: "Select actions to gain information about the world, thereby testing hypotheses through active environment interaction.",
  },
];
