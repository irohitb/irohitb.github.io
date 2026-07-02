# Apple Health export → site

Produce a monthly export on your phone, drop it **in this folder**, and run:

```bash
npm run build:health   # parses the newest export → src/data/health.yml
```

Then commit **`src/data/health.yml`** (the 3 summary numbers) and push. The site
rebuilds from it.

> **Privacy:** the raw export files here are **git-ignored** — they contain
> granular data (heart rate, sleep, per-workout details) that should not live in
> a public repo. Only the derived summary `src/data/health.yml` is committed. So
> the flow is "drop file → run `build:health` → commit health.yml", not "commit
> the raw export".

There is no cloud API for Apple Health, so this is the pipeline: you produce the
export on your phone, this repo turns it into the numbers shown on the site. The
numbers are taken over the **whole export period** (one month per file).

## Accepted formats

### 1. Health Export Kit — JSON (the app in use)

Already summarised per month. The parser reads `activity.totals`,
`activity.daily`, and `activity.workouts`. Just drop the `.json` here — any name
(e.g. `health-export-json-2026-06-01-0000_to_2026-06-30-0000.json`).

Shape (abridged):

```json
{
  "meta": { "app": "Health Export Kit" },
  "activity": {
    "daily":    [ { "date": "2026-06-01", "steps": 10427, "activeEnergyKcal": 429.4, "workoutCount": 1 } ],
    "totals":   { "steps": 380038, "activeEnergyKcal": 8081.9, "workoutCount": 19 },
    "workouts": [ { "start": "2026-06-01T09:34:00Z", "durationSec": 4400 } ]
  }
}
```

### 2. Health Auto Export — JSON (`data.metrics`)

The [Health Auto Export](https://www.healthexportapp.com/) app format
(`step_count` / `active_energy` metrics + `workouts`). Filtered to the current
calendar month.

### 3. Native Apple Health export (`export.zip` / `export.xml`)

From the iOS Health app: profile picture → **Export All Health Data** → you get
`export.zip` containing `export.xml`.

- You can drop either `export.zip` **or** the extracted `export.xml` here.
- The workflow unzips `.zip` automatically before parsing.
- ⚠️ This file is **large** (often 100 MB+). Prefer format 1 to keep the repo
  small. If you use it, consider removing the raw file after the action has
  generated `health.yml`.

## What gets computed

For the **current calendar month**:

| Field                 | From                                  |
| --------------------- | ------------------------------------- |
| `workoutsThisMonth`   | count of workouts                     |
| `kcalBurnedThisMonth` | sum of active energy (kcal)           |
| `dailyStepsAvg`       | steps summed per day, then averaged   |

If a metric is missing from the export, the previous value in `health.yml` is
kept — a partial export never zeroes-out or breaks the site.

> Note: step counts from multiple devices (iPhone + Watch) can overlap, so the
> daily-step average is an approximation. Good enough for a portfolio number.

## Run it locally

```bash
npm run build:health   # regenerate src/data/health.yml from this folder
npm run build          # build:health + astro build
```
