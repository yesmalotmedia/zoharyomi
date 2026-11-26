// "דף השיעור החדש": לימוד עם הרב (ודף מקורות, כשיש) לכל שיעור עיון.
// הנתונים נבנים מחוץ לאתר (zohar-transcribe/batch) ונשמרים בקובץ לכל שיעור:
//   data/lessons/iyun/<id>.json  =  { study: { sentences, anchors }, sheet?: {...} }
//
// מוסתר כרגע (PUBLIC = false). כש-PUBLIC = true: לשונית "לימוד עם הרב (בטא)" לכולם, והדף נפתח ב"משולב" כמו קודם.
// PUBLIC = false מסתיר שוב, ואז רק ?preview=<PREVIEW_KEY> מציג.
import { readFile } from "node:fs/promises";
import path from "node:path";

export const PUBLIC = false;
export const PREVIEW_KEY = "hY7qW2mXc9Lp";

const DIR = path.join(process.cwd(), "data", "lessons");

export async function getLessonExtras(type, lessonId, preview) {
  if (!PUBLIC && preview !== PREVIEW_KEY) return null;
  if (!/^\d+$/.test(String(lessonId))) return null;
  try {
    return JSON.parse(await readFile(path.join(DIR, type, `${lessonId}.json`), "utf8"));
  } catch {
    return null; // לשיעור הזה עוד אין נתונים
  }
}
