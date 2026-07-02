// Core identity, links, and the hero typing-animation lines.
// Data in profile.yml (hand-edited — pure static content, no API).

import { loadYaml } from "./_load";

export interface Profile {
  name: string;
  status: string;
  email: string;
  whatsapp: string;
  socials: {
    github: string;
    githubUser: string;
    x: string;
    linkedin: string;
    npm: string;
  };
  resumeUrl: string;
}

// Shown only in the "Agent" view of the Human/Agent toggle.
export interface AgentBrief {
  headline: string;
  message: string;
  facts: string[];
}

// Résumé source (Google Doc) + output path, used by scripts/build-resume.mjs
// and the resume workflow. The site links via profile.resumeUrl.
export interface Resume {
  sourceDocId: string;
  output: string;
}

interface ProfileFile {
  profile: Profile;
  // Lines the hero types out one after another (client-side animation).
  heroTyping: string[];
  agentBrief: AgentBrief;
  resume: Resume;
}

const FALLBACK: ProfileFile = {
  profile: {
    name: "Rohit Bhatia",
    status: "",
    email: "",
    whatsapp: "#",
    socials: { github: "#", githubUser: "", x: "#", linkedin: "#", npm: "#" },
    resumeUrl: "#",
  },
  heroTyping: [],
  agentBrief: { headline: "", message: "", facts: [] },
  resume: { sourceDocId: "", output: "public/resume.pdf" },
};

const data = loadYaml<ProfileFile>("profile.yml", FALLBACK);

export const profile = data.profile;
export const heroTyping = data.heroTyping;
export const agentBrief = data.agentBrief;
export const resume = data.resume;
