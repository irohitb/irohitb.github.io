// LinkedIn endorsements / connections — hand-edited (no API).
// A lighter-weight companion to recommendations: name + title + how we know
// each other, no long quote.

import { loadYaml } from "./_load";

export interface Endorsement {
  avatar?: string;
  name: string;
  title: string;
  // How Rohit knows them, e.g. "Colleague at Dyte".
  relationship?: string;
}

export const endorsements = loadYaml<Endorsement[]>("endorsements.yml", []);
