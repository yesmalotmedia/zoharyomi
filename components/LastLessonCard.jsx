"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LastLessonCard() {
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lastLesson");
      if (!raw) return;
      setLesson(JSON.parse(raw));
    } catch {}
  }, []);

  if (!lesson) return null;

  return (
    <div style={styles.bar}>
      <div style={styles.text}>
        השיעור האחרון שלמדת:
        <span style={styles.meta}>
          דף {lesson.daf} · עמוד {lesson.page} · פסקה {lesson.par}
        </span>
      </div>

      <div style={styles.actions}>
        <Link href={lesson.url} style={styles.secondaryBtn}>
          לשיעור האחרון שלי
        </Link>

        {lesson.nextId && (
          <Link
            href={`/shiur/${lesson.type}/${lesson.nextId}`}
            style={styles.primaryBtn}
          >
            לשיעור הבא ←
          </Link>
        )}
      </div>
    </div>
  );
}

/* ===== styles ===== */

const styles = {
  bar: {
    width: "100%",
    background: "#ffffff",
    padding: "10px 16px",
    borderBottom: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-Around",
    gap: 12,
    flexWrap: "wrap",
    direction: "rtl",
  },

  text: {
    fontSize: "0.95rem",
    color: "#333",
    whiteSpace: "nowrap",
  },

  meta: {
    marginRight: 6,
    color: "#555",
    fontWeight: 500,
  },

  actions: {
    display: "flex",
    gap: 8,
    flexShrink: 0,
  },

  primaryBtn: {
    background: "#1b73c0",
    color: "white",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 600,
  },

  secondaryBtn: {
    background: "#f2f2f2",
    color: "#1b73c0",
    padding: "6px 12px",
    borderRadius: 6,
    textDecoration: "none",
    fontSize: "0.85rem",
    fontWeight: 500,
  },
};
