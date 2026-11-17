// גישה לדפי /preview (דפים לפני פרסום) - בסיסמה אחת משותפת, שמוגדרת ב-PREVIEW_PASSWORD.
// בעוגייה נשמר hash של הסיסמה, לא הסיסמה עצמה. החלפת הסיסמה ב-Vercel מנתקת את כל מי שנכנס.
export const PREVIEW_COOKIE = "zy_preview";

export async function previewToken(password) {
  const data = new TextEncoder().encode(`zohar-yomi-preview:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// מאפשרים לחזור אחרי הכניסה רק לדף תצוגה מקדימה באתר עצמו
export function safePreviewPath(path) {
  return typeof path === "string" && /^\/preview\/[\w\-\/]*$/.test(path) && !path.startsWith("/preview/login")
    ? path
    : "/";
}
