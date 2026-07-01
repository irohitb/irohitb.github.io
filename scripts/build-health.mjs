// Build `src/data/health.yml` from an Apple Health export.
//
// Drop an export into `data/health-export/` and run `npm run build:health`
// (the GitHub Action does this for you). Two formats are supported:
//
//   1. Health Auto Export (iOS app) JSON  — RECOMMENDED. Small, clean files.
//   2. Apple Health native export.xml     — the big "Export All Health Data"
//      file. Works, but is large; the workflow unzips export.zip for you.
//
// The script is best-effort and never throws out: if a metric can't be
// computed it keeps the previous value from health.yml, so a partial or empty
// export can never zero-out or break the site (mirrors portfolio rule #2).

import { createReadStream } from "node:fs";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const ROOT = path.resolve(fileURLToPath(import.meta.url), "../..");
const EXPORT_DIR = path.join(ROOT, "data", "health-export");
const OUT_FILE = path.join(ROOT, "src", "data", "health.yml");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const now = new Date();
const MONTH = now.getUTCMonth();
const YEAR = now.getUTCFullYear();

function inCurrentMonth(date) {
  return date.getUTCFullYear() === YEAR && date.getUTCMonth() === MONTH;
}

function formatSteps(avg) {
  if (!Number.isFinite(avg) || avg <= 0) return null;
  const rounded = Math.round(avg);
  return rounded >= 1000 ? `${(rounded / 1000).toFixed(1)}k` : String(rounded);
}

// Average of per-day step totals across the days that have data this month.
function averageDailySteps(perDayTotals) {
  const days = Object.values(perDayTotals);
  if (days.length === 0) return null;
  return days.reduce((a, b) => a + b, 0) / days.length;
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Format 1 — Health Auto Export JSON
// ---------------------------------------------------------------------------

function parseAutoExportJson(json) {
  const metrics = json?.data?.metrics ?? [];
  const workouts = json?.data?.workouts ?? [];

  const find = (name) => metrics.find((m) => m?.name === name)?.data ?? [];

  // Workouts this month
  let workoutsThisMonth = 0;
  for (const w of workouts) {
    const d = new Date(w.start ?? w.date ?? w.startDate);
    if (!Number.isNaN(d.valueOf()) && inCurrentMonth(d)) workoutsThisMonth++;
  }

  // Active energy (kcal) this month
  let kcal = 0;
  let sawEnergy = false;
  for (const row of find("active_energy")) {
    const d = new Date(row.date);
    if (!Number.isNaN(d.valueOf()) && inCurrentMonth(d)) {
      kcal += Number(row.qty) || 0;
      sawEnergy = true;
    }
  }

  // Steps this month — sum per day, then average
  const perDay = {};
  for (const row of find("step_count")) {
    const d = new Date(row.date);
    if (!Number.isNaN(d.valueOf()) && inCurrentMonth(d)) {
      perDay[dayKey(d)] = (perDay[dayKey(d)] || 0) + (Number(row.qty) || 0);
    }
  }

  return {
    workoutsThisMonth: workouts.length ? workoutsThisMonth : null,
    kcalBurnedThisMonth: sawEnergy ? Math.round(kcal) : null,
    dailyStepsAvg: formatSteps(averageDailySteps(perDay)),
  };
}

// ---------------------------------------------------------------------------
// Format 2 — Apple Health native export.xml (streamed, regex over open tags)
// ---------------------------------------------------------------------------

const ATTR = (name) => new RegExp(`${name}="([^"]*)"`);
const TYPE_RE = ATTR("type");
const VALUE_RE = ATTR("value");
const START_RE = ATTR("startDate");

const STEP_TYPE = "HKQuantityTypeIdentifierStepCount";
const ENERGY_TYPE = "HKQuantityTypeIdentifierActiveEnergyBurned";

async function parseNativeXml(filePath) {
  let workoutsThisMonth = 0;
  let kcal = 0;
  let sawEnergy = false;
  let sawWorkout = false;
  const perDay = {};

  const rl = createInterface({
    input: createReadStream(filePath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Records and workouts are single self-closing/opening tags in the export.
    const isRecord = line.includes("<Record ");
    const isWorkout = line.includes("<Workout ");
    if (!isRecord && !isWorkout) continue;

    const startMatch = line.match(START_RE);
    if (!startMatch) continue;
    const date = new Date(startMatch[1]);
    if (Number.isNaN(date.valueOf()) || !inCurrentMonth(date)) continue;

    if (isWorkout) {
      sawWorkout = true;
      workoutsThisMonth++;
      continue;
    }

    const type = line.match(TYPE_RE)?.[1];
    const value = Number(line.match(VALUE_RE)?.[1]) || 0;
    if (type === ENERGY_TYPE) {
      kcal += value;
      sawEnergy = true;
    } else if (type === STEP_TYPE) {
      perDay[dayKey(date)] = (perDay[dayKey(date)] || 0) + value;
    }
  }

  return {
    workoutsThisMonth: sawWorkout ? workoutsThisMonth : null,
    kcalBurnedThisMonth: sawEnergy ? Math.round(kcal) : null,
    dailyStepsAvg: formatSteps(averageDailySteps(perDay)),
  };
}

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

async function pickExportFile() {
  let entries;
  try {
    entries = await readdir(EXPORT_DIR);
  } catch {
    return null;
  }
  // Prefer JSON (Health Auto Export), else fall back to xml.
  const json = entries.filter((f) => f.toLowerCase().endsWith(".json"));
  const xml = entries.filter((f) => f.toLowerCase().endsWith(".xml"));
  const chosen = json[0] ?? xml[0];
  return chosen ? path.join(EXPORT_DIR, chosen) : null;
}

async function readExistingYaml() {
  try {
    return parseYaml(await readFile(OUT_FILE, "utf8")) ?? {};
  } catch {
    return {};
  }
}

async function main() {
  const file = await pickExportFile();
  const existing = await readExistingYaml();

  if (!file) {
    console.warn(
      `[health] no export found in ${path.relative(ROOT, EXPORT_DIR)} — keeping existing health.yml`,
    );
    return;
  }

  console.log(`[health] parsing ${path.relative(ROOT, file)}`);
  let parsed;
  try {
    if (file.toLowerCase().endsWith(".json")) {
      parsed = parseAutoExportJson(JSON.parse(await readFile(file, "utf8")));
    } else {
      parsed = await parseNativeXml(file);
    }
  } catch (err) {
    console.warn("[health] parse failed — keeping existing health.yml:", err);
    return;
  }

  // Merge: only overwrite a field when this export produced a value for it.
  const merged = {
    workoutsThisMonth:
      parsed.workoutsThisMonth ?? existing.workoutsThisMonth ?? 0,
    kcalBurnedThisMonth:
      parsed.kcalBurnedThisMonth ?? existing.kcalBurnedThisMonth ?? 0,
    dailyStepsAvg: parsed.dailyStepsAvg ?? existing.dailyStepsAvg ?? "0",
    generatedAt: now.toISOString(),
    sourceFile: path.basename(file),
  };

  const header =
    "# Generated by scripts/build-health.mjs from an Apple Health export.\n" +
    "# Do not edit by hand — drop a new export in data/health-export/ and\n" +
    "# run `npm run build:health` (or push to trigger the workflow).\n";

  await writeFile(OUT_FILE, header + stringifyYaml(merged), "utf8");
  console.log(`[health] wrote ${path.relative(ROOT, OUT_FILE)}`);
  console.log(merged);
}

main();
