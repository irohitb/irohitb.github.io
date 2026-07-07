// Plain-text / markdown brief for AI agents, built from the same YAML as the
// on-page "Agent" view (AgentView.astro). Shared by the /agent and /llms.txt
// routes so they can never drift. Pure text — no HTML, images, or styling.
//
// Regenerated on every build, so the deploy workflow keeps it current.

import { profile, agentBrief, heroTyping } from "./profile";
import { work } from "./work";
import { recommendations } from "./recommendations";
import { birthdayInfo, lifeStatic } from "./life";
import { getHealth } from "./health";
import { getContributions } from "./github";
import { music } from "./music";
import { blogs, movies } from "./offTheClock";
import { experience } from "./experience";

export function buildAgentText(): string {
  const site = "https://rohitbhatia.com/";
  const { age, daysUntil } = birthdayInfo();
  const contributions = getContributions();
  const health = getHealth();
  const L: string[] = [];

  L.push(`# ${profile.name}`, "");
  L.push(agentBrief.headline, "");
  L.push(agentBrief.message, "");
  if (experience.summary) L.push(experience.summary, "");

  L.push("## Now", "");
  for (const line of heroTyping) L.push(`- ${line}`);
  L.push("");

  L.push("## Experience", "");
  for (const w of work) {
    const note = w.note ? ` (${w.note})` : "";
    const does = w.does ? ` · ${w.does}` : "";
    const year = `20${w.year.replace(/\D/g, "")}`;
    L.push(`- ${w.company}${note} — ${w.role}${does} [${year}]`);
  }
  L.push("");

  if (experience.highlights.length) {
    L.push("## Highlights", "");
    for (const h of experience.highlights) L.push(`- ${h}`);
    L.push("");
  }

  if (experience.skills.length) {
    L.push("## Skills", "");
    L.push(experience.skills.join(", "));
    L.push("");
  }

  L.push("## Recommendations", "");
  for (const r of recommendations) {
    L.push(`"${r.full}" — ${r.name}, ${r.title}`, "");
  }

  L.push("## Life", "");
  L.push(`- ${age} years old — next birthday in ${daysUntil} days`);
  L.push(`- ${lifeStatic.location} · ${lifeStatic.locationSub}`);
  L.push(`- ${contributions.toLocaleString()} GitHub contributions (last 365 days)`);
  L.push(`- ${lifeStatic.focus} · ${lifeStatic.focusSub}`);
  L.push(
    `- ${health.workoutsThisMonth} workouts · ${health.kcalBurnedThisMonth.toLocaleString()} kcal · ${health.dailyStepsAvg} steps/day`,
  );
  L.push(`- Now playing: ${music.nowPlaying.track} — ${music.nowPlaying.artist}`);
  L.push("");

  L.push("## Reading", "");
  for (const b of blogs) L.push(`- ${b.title} — ${b.href}`);
  L.push("");

  L.push("## Movies", "");
  for (const m of movies) L.push(`- ${m.title} — ${m.meta}`);
  L.push("");

  L.push("## Music", "");
  for (const t of music.topTracks) L.push(`- ${t.track} — ${t.artist}`);
  L.push("");

  L.push("## Contact", "");
  L.push(`- Email: ${profile.email}`);
  L.push(`- Book a call: ${profile.calendly}`);
  L.push(`- WhatsApp: ${profile.whatsapp} (username — search in WhatsApp)`);
  L.push(`- GitHub: ${profile.socials.github}`);
  L.push(`- LinkedIn: ${profile.socials.linkedin}`);
  L.push(`- X: ${profile.socials.x}`);
  L.push(`- npm: ${profile.socials.npm}`);
  L.push(`- Résumé: ${site}resume.pdf`);
  L.push(`- Site: ${site}`);
  L.push("");

  return L.join("\n");
}
