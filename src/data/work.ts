// Work history timeline. Data in work.yml (hand-edited — no LinkedIn API).

import { loadYaml } from "./_load";

export interface WorkEntry {
  company: string;
  role: string;
  year: string;
  href: string;
  does?: string;
  logo?: string;
  note?: string;
  star?: boolean;
}

export const work = loadYaml<WorkEntry[]>("work.yml", []);
