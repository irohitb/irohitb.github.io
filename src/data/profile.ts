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

interface ProfileFile {
  profile: Profile;
  // Lines the hero types out one after another (client-side animation).
  heroTyping: string[];
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
};

const data = loadYaml<ProfileFile>("profile.yml", FALLBACK);

export const profile = data.profile;
export const heroTyping = data.heroTyping;
