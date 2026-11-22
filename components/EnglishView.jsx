"use client";

import { useEffect, useRef, useState } from "react";

/* שיעור באנגלית (ניסיון): סיכום, מונחים ותמלול מתורגם שעוקב אחרי הסרטון.
   Captions - הכתובית שעל הסרטון. הטקסט נבנה ב-zohar-transcribe/english (build.py). */

const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

// הכתובית האחרונה שכבר התחילה (ממוינות לפי זמן)
function cueIndex(cues, now) {
  let lo = 0, hi = cues.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (cues[mid].t <= now) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

export function Captions({ cues, now }) {
  const cue = cues[cueIndex(cues, now)];
  if (!cue || now > cue.e) return null;
  return (
    <div style={styles.captionLayer} dir="ltr" lang="en">
      <span style={{ ...styles.caption, ...(cue.kind ? styles.captionReading : null) }}>{cue.text}</span>
    </div>
  );
}

export default function EnglishView({ data, now, playing, onSeek, textSize }) {
  const [follow, setFollow] = useState(false);
  const listRef = useRef(null);
  const i = playing ? cueIndex(data.cues, now) : -1;

  // התמלול נגלל בתוך עצמו בלבד, והסרטון נשאר על המסך
  useEffect(() => {
    const list = listRef.current;
    const el = follow && list ? list.children[i] : null;
    if (el) list.scrollTo({ top: el.offsetTop - list.clientHeight / 3, behavior: "smooth" });
  }, [i, follow]);

  return (
    <div dir="ltr" lang="en" style={{ ...styles.wrap, fontSize: textSize }}>
      <p style={styles.notice}>
        <strong>Trial version.</strong> Machine translation, not yet reviewed. Lines marked “check” are uncertain because
        the recording was hard to hear. Quotations from books are translated from what is heard, not from the printed text.
      </p>

      <h2 style={styles.title}>{data.title}</h2>
      <p style={styles.subtitle}>{data.subtitle}</p>

      <h3 style={styles.heading}>Summary</h3>
      {data.summary.map((p) => (
        <p key={p} style={styles.paragraph}>
          {p}
        </p>
      ))}

      <h3 style={styles.heading}>Terms in this lesson</h3>
      <dl style={styles.terms}>
        {data.terms.map(([term, meaning]) => (
          <div key={term} style={styles.term}>
            <dt style={styles.termName}>{term}</dt>
            <dd style={styles.termMeaning}>{meaning}</dd>
          </div>
        ))}
      </dl>

      <div style={styles.transcriptHead}>
        <h3 style={{ ...styles.heading, margin: 0 }}>Full transcript</h3>
        <label style={styles.followLabel}>
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} /> Follow the video
        </label>
      </div>
      <p style={styles.legend}>
        <em>Italic</em>: the rabbi is reading from the Zohar or another book. Click a line to play it.
      </p>
      <div ref={listRef} style={styles.list}>
        {data.cues.map((c, k) => (
          <button
            key={c.t}
            type="button"
            onClick={() => onSeek(c.t)}
            style={{ ...styles.line, ...(k === i ? styles.lineNow : null) }}
          >
            <span style={styles.time}>{formatTime(c.t)}</span>
            <span style={c.kind ? { fontStyle: "italic" } : undefined}>
              {c.text}
              {c.check && <span style={styles.check}>check</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  // מעל פס הבקרה של יוטיוב; לא חוסם לחיצות על הנגן. גודל האות לפי גודל הסרטון (cqw)
  captionLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    containerType: "size",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  caption: {
    marginBottom: "max(48px, 9cqh)",
    maxWidth: "88%",
    padding: "0.2em 0.6em",
    borderRadius: 6,
    background: "rgba(0,0,0,0.78)",
    color: "#fff",
    fontSize: "clamp(13px, 2.7cqw, 26px)",
    lineHeight: 1.35,
    textAlign: "center",
    textWrap: "balance",
  },
  captionReading: { color: "#fde68a", fontStyle: "italic" },

  wrap: { textAlign: "left", lineHeight: 1.65, color: "#1b2433" },
  notice: {
    margin: "0 0 22px",
    padding: "10px 14px",
    borderRadius: 10,
    background: "#fff6dd",
    border: "1px solid #f0dca4",
    fontSize: 14,
  },
  title: { margin: 0, fontSize: 26, color: "#0a3a75" },
  subtitle: { margin: "4px 0 20px", color: "#5d6675", fontSize: 15 },
  heading: { margin: "24px 0 8px", fontSize: 19, color: "#0a3a75" },
  paragraph: { margin: "0 0 12px" },
  terms: { margin: 0, display: "grid", gap: 8 },
  term: { display: "flex", flexWrap: "wrap", columnGap: 10 },
  termName: { fontWeight: 700, minWidth: 170 },
  termMeaning: { margin: 0, flex: "1 1 260px" },
  transcriptHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 28,
  },
  followLabel: { fontSize: 14, cursor: "pointer" },
  legend: { margin: "4px 0 10px", fontSize: 14, color: "#5d6675" },
  list: {
    position: "relative",
    maxHeight: "60vh",
    overflowY: "auto",
    border: "1px solid #e3e6ec",
    borderRadius: 12,
    background: "#fff",
  },
  line: {
    display: "flex",
    gap: 14,
    alignItems: "baseline",
    width: "100%",
    padding: "7px 14px",
    border: "none",
    background: "none",
    font: "inherit",
    color: "inherit",
    textAlign: "left",
    cursor: "pointer",
  },
  lineNow: { background: "#fde68a" },
  time: { color: "#0a3a75", fontWeight: 700, fontSize: 13, minWidth: 40, fontVariantNumeric: "tabular-nums" },
  check: {
    marginLeft: 8,
    padding: "1px 7px",
    borderRadius: 999,
    background: "#fbe3df",
    color: "#a3301f",
    fontSize: 12,
    fontStyle: "normal",
  },
};
