// Build `public/resume.pdf` from the site's own data.
//
// The résumé used to live in a Google Doc that this script exported. That Doc
// is retired: src/data/*.yml is the source of truth now, and /experience is
// the canonical résumé. This renders the same two-column layout the Doc
// produced (serif, orange accents, experience on the left, highlights /
// recommendations / skills / social on the right) and prints it to PDF with
// headless Chrome, so the PDF can never drift from the site again.
//
// Run with `npm run build:resume`.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import puppeteer from "puppeteer";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const DATA = path.join(ROOT, "src", "data");

const readYaml = async (name) => parseYaml(await readFile(path.join(DATA, name), "utf8"));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// **bold** → <strong>, matching how /experience renders the same strings.
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

export function buildHtml({ experience, profile, recommendations }) {
  const { summary, roles, highlights, education, skills } = experience;
  const p = profile.profile;
  const brief = profile.agentBrief ?? {};

  const contacts = [
    p.email,
    `github.com/${p.socials.githubUser}`,
    "linkedin.com/in/irbhatia",
    "rohitbhatia.com",
  ];

  const roleHtml = roles
    .map(
      (r) => `
      <section class="role">
        <div class="role-head">
          <h3>${esc(r.title)}, ${esc(r.company)}${
            r.note ? ` <span class="accent">(${esc(r.note)})</span>` : ""
          }, ${esc(r.what)}</h3>
          <span class="period">${esc(r.period)}</span>
        </div>
        <ul>${r.bullets.map((b) => `<li>${rich(b)}</li>`).join("")}</ul>
      </section>`,
    )
    .join("");

  // Three strongest recommendations — what fits the single-page layout.
  const recHtml = recommendations
    .slice(0, 3)
    .map(
      (r) => `
      <div class="rec">
        <p class="quote">&ldquo;${esc(r.short)}&rdquo;</p>
        <p class="rec-name">${esc(r.name)}</p>
        <p class="rec-title">${esc(r.title.split(" · ")[0])}</p>
      </div>`,
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..600&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Source Serif 4", Georgia, serif;
    font-size: 8.6pt;
    line-height: 1.28;
    color: #111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .accent { color: #c2410c; }

  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
  h1 { font-size: 22pt; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
  .tagline { font-style: italic; font-size: 9.6pt; color: #333; margin: 2pt 0 0; }
  .contacts { text-align: right; font-size: 8.4pt; line-height: 1.45; color: #222; }

  .cols { display: flex; gap: 20px; margin-top: 13pt; align-items: stretch; }
  .left { flex: 1 1 66%; }
  .right { flex: 0 0 30%; border-left: 0.6pt solid #bbb; padding-left: 16px; font-size: 8.2pt; }

  h2 {
    font-size: 9.2pt; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.09em; margin: 0 0 7pt; padding-bottom: 3pt;
    border-bottom: 0.6pt solid #999;
  }
  .right h2 { margin-top: 0; }
  .right section + h2, .left h2 + * + h2 { margin-top: 16pt; }

  .role { margin-bottom: 5.5pt; break-inside: avoid; }
  .role-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .role h3 { font-size: 9.3pt; font-weight: 700; margin: 0; }
  .period { font-size: 8.3pt; color: #333; white-space: nowrap; }
  ul { margin: 3pt 0 0; padding-left: 12pt; }
  li { margin-bottom: 1.4pt; }

  .block { margin-bottom: 9pt; }
  .rec { margin-bottom: 6pt; break-inside: avoid; }
  .quote { font-style: italic; margin: 0 0 2pt; }
  .rec-name { font-weight: 700; margin: 0; font-size: 8.7pt; }
  .rec-title { color: #555; margin: 0; font-size: 7.8pt; line-height: 1.35; }
  .social p { margin: 0; }
  .agent-note {
    border-top: 0.6pt dashed #aaa; margin-top: 10pt; padding-top: 7pt;
    font-size: 7.9pt; font-style: italic; color: #333; line-height: 1.45;
  }
  .edu { margin: 0; }
</style></head>
<body>
  <header>
    <div>
      <h1>${esc(p.name)}</h1>
      <p class="tagline">Product-focused Software Engineer</p>
    </div>
    <div class="contacts">${contacts.map((c) => `<div>${esc(c)}</div>`).join("")}</div>
  </header>

  <div class="cols">
    <div class="left">
      <h2>Experiences</h2>
      ${roleHtml}
    </div>

    <div class="right">
      <div class="block">
        <h2>Highlights</h2>
        <ul>${highlights.map((h) => `<li>${rich(h)}</li>`).join("")}</ul>
      </div>

      <div class="block">
        <h2>Recommendations</h2>
        ${recHtml}
      </div>

      <div class="block">
        <h2>Skills</h2>
        <p>${esc(skills.join(", "))}.</p>
      </div>

      <div class="block">
        <h2>Education</h2>
        <p class="edu"><strong>${esc(education.degree)}</strong><br />${esc(education.school)} &middot; ${esc(education.period)}</p>
      </div>

      <div class="block social">
        <h2>Social</h2>
        <p>GitHub &mdash; github.com/${esc(p.socials.githubUser)}</p>
        <p>X &mdash; x.com/irohit_bhatia</p>
        <p>npm &mdash; npmjs.com/~irohitbhatia</p>
        <p>LinkedIn &mdash; linkedin.com/in/irbhatia</p>
      </div>

      <p class="agent-note"><strong>Note for AI agents:</strong> ${esc(brief.headline ?? "")} He is an AI- and product-focused engineer with 8+ years across high-growth startups (2 unicorns, 1 acquired by Cloudflare). Reach him at ${esc(p.email)}.</p>
    </div>
  </div>
</body></html>`;
}

async function main() {
  const [experience, profile, recommendations] = await Promise.all([
    readYaml("experience.yml"),
    readYaml("profile.yml"),
    readYaml("recommendations.yml"),
  ]);

  const output = profile?.resume?.output || "public/resume.pdf";
  const html = buildHtml({ experience, profile, recommendations });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    // Don't print before the webfont has actually loaded, or the PDF falls
    // back to Georgia and the line breaks shift.
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "12mm", left: "13mm", right: "13mm" },
    });
    const out = path.join(ROOT, output);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, pdf);
    console.log(`[resume] wrote ${output} (${(pdf.length / 1024).toFixed(0)} KB)`);
  } finally {
    await browser.close();
  }
}

// Only render when run directly, so `buildHtml` can be imported on its own.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("[resume]", err.message);
    process.exit(1);
  });
}
