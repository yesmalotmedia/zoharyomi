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
import iyun926 from "./iyun-926.json";
import iyun926Passage from "./iyun-926.passage.json";
import iyun927 from "./iyun-927.json";
import iyun927Passage from "./iyun-927.passage.json";

const SHEETS = {
  prsvnIJSjucKxmqn: { type: "iyun", lessonId: "32", sheet: iyun32, study: iyun32Passage },
  rA11lld0wyHaqTnL: { type: "iyun", lessonId: "925", sheet: iyun925, study: iyun925Passage },
  u5w9oRL1nxPhKy1Q: { type: "iyun", lessonId: "926", sheet: iyun926, study: iyun926Passage },
  aQNjAJ2pMNRXk3aL: { type: "iyun", lessonId: "927", sheet: iyun927, study: iyun927Passage },
};

export function getSharedSheet(token) {
  return Object.hasOwn(SHEETS, token) ? SHEETS[token] : null;
}
