// דפי מקורות של שיעורים - המקורות שהרב הביא בשיעור, עם הזמן בסרטון.
// כרגע נבנים בסקריפט מחוץ לאתר (zohar-transcribe/sources) ונשמרים כאן כ-JSON:
//   iyun-<id>.json          המקורות (make-sheet.cjs)
//   iyun-<id>.passage.json  משפטי הזוהר ומתי הרב קרא כל משפט - ל"לימוד עם הרב" (align-passage.cjs)
//
// עד שיאושרו, כל דף נפתח רק בקישור סודי: /s/<token>. אין אליו קישור מהאתר, והוא לא באינדקס של גוגל.
// כדי לבטל גישה לדף - מחליפים את ה-token (הקישור הישן יחזיר 404).
import iyun32 from "./iyun-32.json";
import iyun32Passage from "./iyun-32.passage.json";
import iyun925 from "./iyun-925.json";
import iyun925Passage from "./iyun-925.passage.json";

const SHEETS = {
  prsvnIJSjucKxmqn: { type: "iyun", lessonId: "32", sheet: iyun32, study: iyun32Passage },
  rA11lld0wyHaqTnL: { type: "iyun", lessonId: "925", sheet: iyun925, study: iyun925Passage },
};

export function getSharedSheet(token) {
  return Object.hasOwn(SHEETS, token) ? SHEETS[token] : null;
}
