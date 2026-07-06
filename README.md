# Rohit Bhatia — Portfolio website

Live at **[rohitbhatia.com](https://rohitbhatia.com)**. All content lives in
`src/data/*.yml`; each file is read by a typed accessor (`src/data/<name>.ts`),
so editing a `.yml` file changes the site.

## Where the data lives & how it's fetched

| Section | File | How it's fetched / updated |
| --- | --- | --- |
| Identity, links, hero lines, agent brief | `profile.yml` | Hand-edited |
| Work history | `work.yml` | Hand-edited |
| Recommendations (short + full) | `recommendations.yml` | Hand-edited |
| Music (now playing + favourites) | `music.yml` | Hand-edited |
| Reading / movies | `offTheClock.yml` | Hand-edited |
| Birthday age + countdown | `life.yml` (DOB) | Computed at build time |
| GitHub contributions | `github.yml` | **Live** — `scripts/build-github.mjs` fetches the last-365-day total from a token-free public API; the deploy workflow runs it hourly |
| Apple Health (workouts/kcal/steps) | `health.yml` | `scripts/build-health.mjs` parses an export dropped in `data/health-export/` (raw exports git-ignored). See [`data/health-export/README.md`](data/health-export/README.md) |
| Résumé PDF | `public/resume.pdf` | `scripts/build-resume.mjs` exports the Google Doc in `profile.yml` (`resume.sourceDocId`); the `resume` workflow opens a PR |

## Human / Agent view

A toggle in the nav swaps the whole page between the normal site and a
plain-text **Agent** view for AI agents. The same brief is served at
[`/agent`](https://rohitbhatia.com/agent) and
[`/llms.txt`](https://rohitbhatia.com/llms.txt).
