// דפי מקורות של שיעורים - המקורות שהרב הביא בשיעור, עם הזמן בסרטון.
// כרגע נבנים בסקריפט מחוץ לאתר (zohar-transcribe) ונשמרים כאן כ-JSON.
//
// עד שיאושרו, כל דף נפתח רק בקישור סודי: /s/<token>. אין אליו קישור מהאתר, והוא לא באינדקס של גוגל.
// כדי לבטל גישה לדף - מחליפים את ה-token (הקישור הישן יחזיר 404).
import iyun32 from "./iyun-32.json";
import iyun925 from "./iyun-925.json";

const SHEETS = {
  prsvnIJSjucKxmqn: { type: "iyun", lessonId: "32", sheet: iyun32 },
  rA11lld0wyHaqTnL: { type: "iyun", lessonId: "925", sheet: iyun925 },
};

export function getSharedSheet(token) {
  return Object.hasOwn(SHEETS, token) ? SHEETS[token] : null;
}
