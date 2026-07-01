# Rohit Bhatia — Portfolio

Static portfolio site built with **Astro** (+ a single React island for the
theme toggle). All content lives in `src/data/*` so it's easy to edit, and the
files are structured as the seam where live API integrations slot in later.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
npm run preview
```

## Where the data comes from

| Section | Source | Status |
| --- | --- | --- |
| Profile, work, recommendations, blogs | `src/data/*` static | Hand-maintained (no usable API) |
| Birthday age / countdown | `src/data/life.ts` | Computed at build from DOB |
| GitHub contributions | `src/data/github.ts` | Hardcoded; live fetch stubbed in |
| Apple Health (workouts/kcal/steps) | `src/data/health.ts` | Hardcoded (no cloud API) |
| Music (now playing / most played) | `src/data/music.ts` | Hardcoded YouTube Music; Last.fm path noted |
| Movies | `src/data/offTheClock.ts` | Curated; optional TMDB enrichment later |

Because this is a static site, "freshness" comes from rebuilding — run
`npm run build` (or wire a scheduled CI job) after the live integrations are
enabled.
