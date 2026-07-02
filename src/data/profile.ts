// Core identity, links, and the "</now>" intro bullets.
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

// `strong` segments are highlighted. Each item has a `logo` OR an `emoji`.
export interface NowItem {
  html: string;
  logo?: string;
  emoji?: string;
}

interface ProfileFile {
  profile: Profile;
  nowItems: NowItem[];
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
  nowItems: [],
};

const data = loadYaml<ProfileFile>("profile.yml", FALLBACK);

export const profile = data.profile;
export const nowItems = data.nowItems;
