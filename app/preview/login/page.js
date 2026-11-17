import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE, previewToken, safePreviewPath } from "@/utils/previewAuth";

export const metadata = {
  title: "כניסה לתצוגה מקדימה",
  robots: { index: false, follow: false },
};

async function login(formData) {
  "use server";
  const next = safePreviewPath(formData.get("next"));
  const password = formData.get("password");
  if (!process.env.PREVIEW_PASSWORD || password !== process.env.PREVIEW_PASSWORD) {
    redirect(`/preview/login?error=1&next=${encodeURIComponent(next)}`);
  }
  (await cookies()).set(PREVIEW_COOKIE, await previewToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/preview",
    maxAge: 60 * 60 * 24 * 30, // חודש - לא צריך להזין שוב בכל כניסה
  });
  redirect(next);
}

export default async function PreviewLogin({ searchParams }) {
  const { next, error } = await searchParams;

  return (
    <div style={styles.page}>
      <form action={login} style={styles.card}>
        <h1 style={styles.title}>תצוגה מקדימה</h1>
        <p style={styles.text}>הדף הזה עדיין לא פורסם. כדי לצפות בו צריך את הסיסמה.</p>
        <input type="hidden" name="next" value={safePreviewPath(next)} />
        <label htmlFor="password" style={styles.label}>
          סיסמה
        </label>
        <input id="password" name="password" type="password" required autoFocus style={styles.input} />
        {error && <p style={styles.error}>הסיסמה שגויה. נסו שוב.</p>}
        <button type="submit" style={styles.button}>
          כניסה
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    direction: "rtl",
  },
  card: {
    width: "100%",
    maxWidth: 360,
    background: "#fff",
    borderRadius: 14,
    padding: 28,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "grid",
    gap: 12,
  },
  title: { fontSize: 22, color: "#0a3a75", margin: 0 },
  text: { margin: 0, color: "#555", fontSize: 15 },
  label: { fontSize: 14, fontWeight: 600, marginTop: 6 },
  input: {
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccd3df",
  },
  error: { margin: 0, color: "#b42318", fontSize: 14 },
  button: {
    marginTop: 6,
    padding: "11px 16px",
    fontSize: 16,
    fontWeight: 600,
    color: "white",
    background: "#0a3a75",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
