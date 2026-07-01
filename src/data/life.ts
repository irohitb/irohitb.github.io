// Life section. Data in life.yml. `dateOfBirth` drives the age + birthday
// countdown, COMPUTED here at build time (no API). `lifeStatic` are plain tiles.

import { loadYaml } from "./_load";

interface LifeStatic {
  location: string;
  locationSub: string;
  focus: string;
  focusSub: string;
}

interface LifeFile {
  dateOfBirth: string;
  lifeStatic: LifeStatic;
}

const data = loadYaml<LifeFile>("life.yml", {
  dateOfBirth: "1997-12-30",
  lifeStatic: { location: "", locationSub: "", focus: "", focusSub: "" },
});

export const dateOfBirth = data.dateOfBirth;
export const lifeStatic = data.lifeStatic;

export function birthdayInfo(dob: string = dateOfBirth, now: Date = new Date()) {
  const born = new Date(dob);
  let age = now.getFullYear() - born.getFullYear();

  const next = new Date(now.getFullYear(), born.getMonth(), born.getDate());
  if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    next.setFullYear(now.getFullYear() + 1);
  }

  // age is years already completed
  const hadBirthdayThisYear =
    now.getMonth() > born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate());
  if (!hadBirthdayThisYear) age -= 1;

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.round(
    (next.getTime() -
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) /
      msPerDay,
  );

  return { age, daysUntil };
}
