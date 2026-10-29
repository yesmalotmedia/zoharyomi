"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const pageLabel = (page) =>
  page === "א" ? 'ע"א' : page === "ב" ? 'ע"ב' : page ?? "";

const lessonLabel = (l) =>
  `דף ${l.daf} ${pageLabel(l.page)}${l.par ? ` · פסקה ${l.par}` : ""}`;

/* ניווט לשיעור קודם / הבא.
   ברירת המחדל (עוד לפני שהרשימה נטענה) היא pageid±1, ואז מחשבים את השכנים
   האמיתיים מתוך רשימת השיעורים (קטנה ושמורה בקאש) - כך מדלגים על מספרים
   חסרים ולא מציגים כפתור "הבא" בשיעור האחרון. */
export default function LessonNav({ type, pageid }) {
  const current = Number(pageid);
  const [nav, setNav] = useState({
    prev: { pageid: current - 1 },
    next: { pageid: current + 1 },
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/${type}`)
      .then((res) => res.json())
      .then(({ items = [] }) => {
        if (cancelled || !items.length) return;

        const sorted = items
          .filter((i) => i.pageid != null)
          .sort((a, b) => Number(a.pageid) - Number(b.pageid));
        const prev = sorted.findLast((i) => Number(i.pageid) < current) ?? null;
        const next = sorted.find((i) => Number(i.pageid) > current) ?? null;
        setNav({ prev, next });

        // "לשיעור הבא" בדף הבית צריך את המספר האמיתי ולא +1
        try {
          const last = JSON.parse(localStorage.getItem("lastLesson") || "null");
          if (last && last.type === type && last.currentId === current) {
            localStorage.setItem(
              "lastLesson",
              JSON.stringify({ ...last, nextId: next?.pageid ?? null }),
            );
          }
        } catch {}
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [type, current]);

  return (
    <div style={styles.navWrapper}>
      {nav.prev ? (
        <Link href={`/shiur/${type}/${nav.prev.pageid}`} style={styles.navButton}>
          → שיעור קודם
          {nav.prev.daf && <span style={styles.sub}>{lessonLabel(nav.prev)}</span>}
        </Link>
      ) : (
        <span style={{ ...styles.navButton, ...styles.disabled }}>זה השיעור הראשון</span>
      )}

      {nav.next ? (
        <Link
          href={`/shiur/${type}/${nav.next.pageid}`}
          style={{ ...styles.navButton, ...styles.nextButton }}
        >
          שיעור הבא ←
          {nav.next.daf && <span style={styles.sub}>{lessonLabel(nav.next)}</span>}
        </Link>
      ) : (
        <span style={{ ...styles.navButton, ...styles.disabled }}>
          זה השיעור האחרון שעלה
        </span>
      )}
    </div>
  );
}

const styles = {
  navWrapper: {
    display: "flex",
    gap: 12,
    marginBottom: 30,
    flexWrap: "wrap",
  },

  navButton: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#f0f4fa",
    color: "#0a3a75",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid #d0d8e8",
  },

  nextButton: {
    background: "#0a3a75",
    color: "white",
    border: "1px solid #0a3a75",
  },

  disabled: {
    opacity: 0.5,
    fontWeight: 500,
  },

  sub: {
    fontSize: 13,
    fontWeight: 400,
    opacity: 0.85,
    marginTop: 2,
  },
};
