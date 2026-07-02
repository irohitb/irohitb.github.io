import type { APIRoute } from "astro";
import { profile, agentBrief } from "../data/profile";
import { work } from "../data/work";

// Plain-text brief served at /llms.txt — the emerging convention for giving
// LLMs / AI agents a concise, machine-readable summary of a site. Generated at
// build time from the same data as the "Agent" view, so it never drifts.
export const GET: APIRoute = () => {
  const site = "https://irohitb.github.io/";
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
    lines.push(`- ${w.company}${note}: ${w.role}${does} [20${w.year.replace(/\D/g, "")}]`);
  }
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Email: ${profile.email}`);
  lines.push(`- GitHub: ${profile.socials.github}`);
  lines.push(`- LinkedIn: ${profile.socials.linkedin}`);
  lines.push(`- X: ${profile.socials.x}`);
  lines.push(`- Site: ${site}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
