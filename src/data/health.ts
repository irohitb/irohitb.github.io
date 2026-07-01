// Apple Health stats.
//
// SOURCE: src/data/health.yml, generated at build time from an Apple Health
// export by scripts/build-health.mjs (see data/health-export/README.md).
// There is NO cloud API for Apple Health, so the pipeline is: you drop an
// export file in data/health-export/ → a GitHub Action parses it → health.yml.
//
// This accessor reads that YAML and falls back to last-known hardcoded values
// if the file is missing or malformed, so the build never breaks (rule #2).

import { loadYaml } from "./_load";

export interface Health {
  workoutsThisMonth: number;
  kcalBurnedThisMonth: number;
  dailyStepsAvg: string;
}

const FALLBACK: Health = {
  workoutsThisMonth: 14,
  kcalBurnedThisMonth: 8420,
  dailyStepsAvg: "6.8k",
};

export function getHealth(): Health {
  const raw = loadYaml<Partial<Health>>("health.yml", FALLBACK);
  return {
    workoutsThisMonth: raw.workoutsThisMonth ?? FALLBACK.workoutsThisMonth,
    kcalBurnedThisMonth: raw.kcalBurnedThisMonth ?? FALLBACK.kcalBurnedThisMonth,
    dailyStepsAvg: raw.dailyStepsAvg ?? FALLBACK.dailyStepsAvg,
  };
}
