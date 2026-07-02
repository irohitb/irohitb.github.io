// Export the résumé Google Doc to PDF.
//
// Reads `resume.sourceDocId` and `resume.output` from src/data/profile.yml,
// downloads the Doc's PDF export, and writes it to the output path. The Doc
// must be shared "anyone with the link can view" (no auth is used). Run via
// `npm run build:resume` or the `resume` GitHub workflow.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const PROFILE = path.join(ROOT, "src", "data", "profile.yml");

async function main() {
  const cfg = parseYaml(await readFile(PROFILE, "utf8"))?.resume ?? {};
  const docId = cfg.sourceDocId;
  const output = cfg.output || "public/resume.pdf";

  if (!docId) {
    console.error("[resume] no resume.sourceDocId in profile.yml");
    process.exit(1);
  }

  const url = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
  console.log(`[resume] downloading ${url}`);

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.error(`[resume] HTTP ${res.status} — is the Doc shared publicly?`);
    process.exit(1);
  }

  const type = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  // A login/permission page comes back as HTML, not a PDF — fail loudly.
  if (!type.includes("pdf") && buf.subarray(0, 5).toString() !== "%PDF-") {
    console.error(
      `[resume] response was not a PDF (content-type: ${type}). ` +
        `Share the Doc as "anyone with the link can view".`,
    );
    process.exit(1);
  }

  const outPath = path.join(ROOT, output);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  console.log(`[resume] wrote ${output} (${buf.length} bytes)`);
}

main().catch((err) => {
  console.error("[resume] failed:", err);
  process.exit(1);
});
