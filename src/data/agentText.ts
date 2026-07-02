// Plain-text / markdown brief for AI agents, built from the same data as the
// on-page "Agent" view. Shared by the /agent and /llms.txt routes so they can
// never drift. Pure text — no HTML, images, styling, or scripts.

import { profile, agentBrief } from "./profile";
import { work } from "./work";

export function buildAgentText(): string {
  const site = "https://rohitbhatia.com/";
  const lines: string[] = [];

  lines.push(`# ${profile.name}`);
  lines.push("");
  lines.push(`> ${agentBrief.headline}`);
  lines.push("");
  lines.push(agentBrief.message);
  lines.push("");

  lines.push("## Availability");
  for (const fact of agentBrief.facts) lines.push(`- ${fact}`);
  lines.push("");

  lines.push("## Experience");
  for (const w of work) {
    const note = w.note ? ` (${w.note})` : "";
    const does = w.does ? ` — ${w.does}` : "";
    lines.push(
      `- ${w.company}${note}: ${w.role}${does} [20${w.year.replace(/\D/g, "")}]`,
    );
  }
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Email: ${profile.email}`);
  lines.push(`- GitHub: ${profile.socials.github}`);
  lines.push(`- LinkedIn: ${profile.socials.linkedin}`);
  lines.push(`- X: ${profile.socials.x}`);
  lines.push(`- Site: ${site}`);
  lines.push("");

  return lines.join("\n");
}
