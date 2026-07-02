import type { APIRoute } from "astro";
import { buildAgentText } from "../data/agentText";

// Plain-text brief served at /llms.txt — the emerging convention for giving
// LLMs / AI agents a concise, machine-readable summary of a site. Shares its
// content with /agent (see src/data/agentText.ts).
export const GET: APIRoute = () =>
  new Response(buildAgentText(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
