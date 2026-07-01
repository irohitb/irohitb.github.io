# Apple Health export → site

Drop an Apple Health export **in this folder**, commit, and push. The
[`health` GitHub Action](../../.github/workflows/health.yml) parses it,
regenerates [`src/data/health.yml`](../../src/data/health.yml), commits the
result, and the site rebuilds from it.

There is no cloud API for Apple Health, so this is the automation: you produce
the export on your phone, this repo turns it into the numbers shown on the site.

## Two accepted formats

### 1. Health Auto Export — JSON (recommended)

The [Health Auto Export](https://www.healthexportapp.com/) iOS app produces
small, clean JSON. Best for committing to git.

1. In the app, export **Steps**, **Active Energy**, and **Workouts** as JSON.
2. Save the `.json` file here (any name, e.g. `health.json`).
3. Commit & push.

Expected shape:

```json
{
  "data": {
    "metrics": [
      { "name": "step_count",    "units": "count", "data": [ { "date": "2026-06-01 00:00:00 +0000", "qty": 8432 } ] },
      { "name": "active_energy", "units": "kcal",  "data": [ { "date": "2026-06-01 00:00:00 +0000", "qty": 540 } ] }
    ],
    "workouts": [ { "name": "Running", "start": "2026-06-01 07:00:00 +0000" } ]
  }
}
```

### 2. Native Apple Health export (`export.zip` / `export.xml`)

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
