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

  const parashiot = hasLessons
    ? Array.from(new Set(lessons.map((l) => clean(l.parasha))))
    : [];

  const dafim =
    parasha && hasLessons
      ? Array.from(
          new Set(
            lessons
              .filter((l) => clean(l.parasha) === clean(parasha))
              .map((l) => clean(l.daf))
          )
        )
      : [];

  useEffect(() => {
    if (!hasLessons) return;

    let filtered = lessons;

    if (parasha)
      filtered = filtered.filter((l) => clean(l.parasha) === clean(parasha));

    if (daf) filtered = filtered.filter((l) => clean(l.daf) === clean(daf));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    onResults(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parasha, daf, lessons]);
  // השמטנו onResults ו-hasLessons כדי לא לייצר רינדור אינסופי

  if (!hasLessons) return null;

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
