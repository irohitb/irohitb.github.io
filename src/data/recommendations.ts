// LinkedIn recommendations. Data in recommendations.yml (hand-edited — no API).

import { loadYaml } from "./_load";

export interface Recommendation {
  avatar?: string;
  // `short` is shown by default; `full` is revealed on "Read more".
  short: string;
  full: string;
  name: string;
  title: string;
  // Relationship + date, e.g. "Anand was Rohit's mentor · Aug 2023".
  relationship?: string;
}

export const recommendations = loadYaml<Recommendation[]>(
  "recommendations.yml",
  [],
);
