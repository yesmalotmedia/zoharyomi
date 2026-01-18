"use client";

import { useEffect, useState } from "react";

export default function SearchFilters({ lessons, onResults }) {
  const [parasha, setParasha] = useState("");
  const [daf, setDaf] = useState("");

  const hasLessons = Array.isArray(lessons) && lessons.length > 0;

  // ניקוי מחרוזות
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
  // המרת דף עברי → מספר (כל גודל)
  // -------------------------
  const HEBREW_VALUES = {
    א: 1,
    ב: 2,
    ג: 3,
    ד: 4,
    ה: 5,
    ו: 6,
    ז: 7,
    ח: 8,
    ט: 9,
    י: 10,
    כ: 20,
    ל: 30,
    מ: 40,
    נ: 50,
    ס: 60,
    ע: 70,
    פ: 80,
    צ: 90,
    ק: 100,
    ר: 200,
    ש: 300,
    ת: 400,
  };

  const dafToIndex = (str) =>
    clean(str)
      .split("")
      .reduce((sum, ch) => sum + (HEBREW_VALUES[ch] || 0), 0);

  // -------------------------
  // רשימת פרשות — לפי סדר
  // -------------------------
  const parashiot = hasLessons
    ? Array.from(new Set(lessons.map((l) => clean(l.parasha))))
        .filter((p) => PARASHA_ORDER.includes(p))
        .sort((a, b) => PARASHA_ORDER.indexOf(a) - PARASHA_ORDER.indexOf(b))
    : [];

  // -------------------------
  // דפים — מיון עברי מלא
  // -------------------------
  const dafim =
    parasha && hasLessons
      ? Array.from(
          new Set(
            lessons
              .filter((l) => clean(l.parasha) === clean(parasha))
              .map((l) => clean(l.daf))
          )
        ).sort((a, b) => dafToIndex(a) - dafToIndex(b))
      : [];

  // -------------------------
  // סינון תוצאות
  // -------------------------
  useEffect(() => {
    if (!hasLessons) return;

    let filtered = lessons;

    if (parasha)
      filtered = filtered.filter((l) => clean(l.parasha) === clean(parasha));

    if (daf) filtered = filtered.filter((l) => clean(l.daf) === clean(daf));

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
