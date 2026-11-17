// דפי מקורות של שיעורים - המקורות שהרב הביא בשיעור, עם הזמן בסרטון.
// כרגע נבנים ידנית/בסקריפט מחוץ לאתר (zohar-transcribe) ונשמרים כאן כ-JSON.
import iyun32 from "./iyun-32.json";

const SHEETS = {
  "iyun-32": iyun32,
};

export function getSourceSheet(type, lessonId) {
  return SHEETS[`${type}-${lessonId}`] ?? null;
}
