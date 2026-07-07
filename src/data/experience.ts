// Full experience / CV data (from the résumé). Rendered by /experience.
// Standalone — not used on the homepage.

import { loadYaml } from "./_load";

// A press / media link shown under a role (funding announcements, articles,
// talks), LinkedIn-style with a thumbnail.
export interface PressLink {
  title: string;
  source: string;
  url: string;
  thumbnail: string;
}

export interface ExperienceRole {
  company: string;
  title: string;
  what: string;
  period: string;
  bullets: string[];
  note?: string;
  logo?: string;
  href?: string;
  links?: PressLink[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface Experience {
  summary: string;
  roles: ExperienceRole[];
  highlights: string[];
  education: Education;
  skills: string[];
}

const FALLBACK: Experience = {
  summary: "",
  roles: [],
  highlights: [],
  education: { degree: "", school: "", period: "" },
  skills: [],
};

export const experience = loadYaml<Experience>("experience.yml", FALLBACK);
