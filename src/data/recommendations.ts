// LinkedIn recommendations. Data in recommendations.yml (hand-edited — no API).

import { loadYaml } from "./_load";

export interface Recommendation {
  avatar: string;
  quote: string;
  name: string;
  title: string;
}

export const recommendations = loadYaml<Recommendation[]>(
  "recommendations.yml",
  [],
);
