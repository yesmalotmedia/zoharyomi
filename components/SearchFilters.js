"use client";

import { useEffect, useState } from "react";

export default function SearchFilters({ lessons, onResults }) {
  const [parasha, setParasha] = useState("");
  const [daf, setDaf] = useState("");

  const hasLessons = Array.isArray(lessons) && lessons.length > 0;

  const clean = (v) =>
    String(v || "")
      .trim()
      .replace(/\s+/g, " ");

  // -------------------------
  // סדר כרונולוגי של פרשות
  // -------------------------
  const PARASHA_ORDER = [
    "בראשית",
    "נח",
    "לך לך",
    "וירא",
    "חיי שרה",
    "תולדות",
    "ויצא",
    "וישלח",
    "וישב",
    "מקץ",
    "ויגש",
    "ויחי",
    "שמות",
    "וארא",
    "בא",
    "בשלח",
    "יתרו",
    "משפטים",
    "תרומה",
    "תצווה",
    "כי תשא",
    "ויקהל",
    "פקודי",
    "ויקרא",
    "צו",
    "שמיני",
    "תזריע",
    "מצורע",
    "אחרי מות",
    "קדושים",
    "אמור",
    "בהר",
    "בחוקותי",
    "במדבר",
    "נשא",
    "בהעלותך",
    "שלח",
    "קורח",
    "חוקת",
    "בלק",
    "פינחס",
    "מטות",
    "מסעי",
    "דברים",
    "ואתחנן",
    "עקב",
    "ראה",
    "שופטים",
    "כי תצא",
    "כי תבוא",
    "נצבים",
    "וילך",
    "האזינו",
    "וזאת הברכה",
  ];

  // -------------------------
  // רשימת פרשות — ממויינת לפי הסדר האמיתי
  // -------------------------
  const parashiot = hasLessons
    ? Array.from(new Set(lessons.map((l) => clean(l.parasha))))
        .filter((p) => PARASHA_ORDER.includes(p)) // נקה שגיאות כתיב
        .sort((a, b) => PARASHA_ORDER.indexOf(a) - PARASHA_ORDER.indexOf(b))
    : [];

  // -------------------------
  // דפים — ממיינים מספרית
  // -------------------------
  const dafim =
    parasha && hasLessons
      ? Array.from(
          new Set(
            lessons
              .filter((l) => clean(l.parasha) === clean(parasha))
              .map((l) => clean(l.daf))
          )
        ).sort((a, b) => Number(a) - Number(b))
      : [];

  // -------------------------
  // סינון + החזרת תוצאות
  // -------------------------
  useEffect(() => {
    if (!hasLessons) return;

    let filtered = lessons;

    if (parasha)
      filtered = filtered.filter((l) => clean(l.parasha) === clean(parasha));

    if (daf) filtered = filtered.filter((l) => clean(l.daf) === clean(daf));

    // מיון לפי pageid לשמירה על סדר תקין
    filtered = [...filtered].sort(
      (a, b) => (Number(b.pageid) || 0) - (Number(a.pageid) || 0)
    );

    onResults(filtered);
  }, [parasha, daf, lessons]);

  if (!hasLessons) return null;

  // -------------------------
  // UI
  // -------------------------
  return (
    <div style={styles.wrapper}>
      {/* פרשה */}
      <select
        style={styles.select}
        value={parasha}
        onChange={(e) => {
          setParasha(e.target.value);
          setDaf("");
        }}
      >
        <option value="">בחר פרשה</option>
        {parashiot.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {/* דף */}
      <select
        style={styles.select}
        value={daf}
        disabled={!parasha}
        onChange={(e) => setDaf(e.target.value)}
      >
        <option value="">בחר דף</option>
        {dafim.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  select: {
    width: 200,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
    cursor: "pointer",
    background: "white",
  },
};
