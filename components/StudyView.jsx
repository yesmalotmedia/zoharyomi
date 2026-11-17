"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Frank_Ruhl_Libre } from "next/font/google";

/* "לימוד עם הרב" - כמו לשבת בשיעור עם הספר פתוח:
   - טקסט הזוהר, וסמן על המשפט שהרב קורא או מסביר כרגע
   - כשהרב מביא מקור אחר - הוא מופיע לצד הזוהר (בטלפון: נפתח מלמטה), עם סמן משלו
   - המקורות שכבר נאמרו נשמרים ב"מקורות קודמים"
   הכל מסונכרן לזמן בסרטון (now). גלילה ידנית עוצרת את המעקב, וכפתור מחזיר אליו. */

const book = Frank_Ruhl_Libre({ subsets: ["hebrew"], weight: ["400", "500", "700"] });

const WIDE = 900; // מעל הרוחב הזה: הזוהר והמקור זה לצד זה
const SOURCE_SHOWN_FOR = 40; // מקור קצר (פסוק, ציטוט) נשאר על המסך כמה שניות אחרי שנאמר
const READING_GAP = 25; // מעבר למשפט הבא תוך פחות מזה = קריאה ברצף, לא הסבר (משפט ארוך נקרא בכ-20 שניות)

const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

// העוגן האחרון שהזמן שלו כבר עבר (העוגנים ממוינים לפי זמן)
function lastAnchor(anchors, now) {
  let lo = 0, hi = anchors.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (anchors[mid].t <= now) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${WIDE}px)`);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

export default function StudyView({ passage, sheet, now, playing, onSeek, video, textSize }) {
  const wide = useWide();
  const [follow, setFollow] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(true); // החלונית התחתונה בטלפון
  const [openPast, setOpenPast] = useState(null);
  const sentenceRefs = useRef([]);
  const segmentRefs = useRef([]);
  const panelRef = useRef(null);

  const anchors = useMemo(() => [...passage.anchors].sort((a, b) => a.t - b.t), [passage]);
  const firstRead = useMemo(() => {
    const first = new Map();
    for (const a of anchors) if (!first.has(a.si)) first.set(a.si, a.t);
    return first;
  }, [anchors]);
  // משפטים בתחילת הקטע שהרב לא קרא בכלל - שייכים לשיעור הקודם
  const lessonStart = useMemo(() => Math.min(...passage.anchors.map((a) => a.si)), [passage]);

  /* --- איפה הרב עכשיו --- */
  const k = lastAnchor(anchors, now);
  const current = k >= 0 ? anchors[k] : null;
  // המעבר הקרוב ממשפט אחר (לפני) ואל משפט אחר (אחרי) - במשפט ארוך יש כמה עוגנים לאותו משפט
  let prev = null;
  for (let p = k - 1; p >= 0; p--) if (anchors[p].si !== current?.si) { prev = anchors[p]; break; }
  let next = null;
  for (let n = k + 1; n < anchors.length; n++) if (anchors[n].si !== current?.si) { next = anchors[n]; break; }
  // קריאה ברצף: הרב הגיע מהמשפט הקודם, או ממשיך למשפט הבא, תוך זמן קצר - ומתקדם קדימה בטקסט
  const reading =
    current &&
    ((prev && current.t - prev.t < READING_GAP && current.si > prev.si) ||
      (next && next.t - current.t < READING_GAP && next.si > current.si));

  const sources = sheet || [];
  const active = [...sources]
    .reverse()
    .find((s) => s.start <= now && now <= (s.end ?? s.start + SOURCE_SHOWN_FOR));
  const past = sources.filter((s) => s.start <= now && s !== active).reverse();
  const activeSeg = active?.anchors ? active.anchors.filter((a) => a.t <= now).at(-1)?.seg : null;

  /* --- מעקב: גוללים אל המשפט הנוכחי, עד שהמשתמש גולל בעצמו --- */
  useEffect(() => {
    const stop = () => setFollow(false);
    const onKey = (e) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) stop();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const smooth = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  const currentSi = current?.si;
  useEffect(() => {
    if (!follow || currentSi == null || !playing) return;
    sentenceRefs.current[currentSi]?.scrollIntoView({ block: "center", behavior: smooth() });
  }, [currentSi, follow, playing]);

  // בתוך חלונית המקור - גלילה פנימית בלבד (לא מזיזה את הדף)
  useEffect(() => {
    const panel = panelRef.current;
    const el = activeSeg != null ? segmentRefs.current[activeSeg] : null;
    if (!follow || !panel || !el) return;
    panel.scrollTo({ top: el.offsetTop - panel.offsetTop - panel.clientHeight / 3, behavior: smooth() });
  }, [activeSeg, follow]);

  useEffect(() => {
    if (active) setSheetOpen(true);
  }, [active]);

  const jump = (t) => {
    setFollow(true);
    onSeek(t);
  };

  /* --- הזוהר --- */
  const status = !playing
    ? "הפעילו את הסרטון, והטקסט יעקוב אחרי הרב"
    : active
      ? `הרב קורא מתוך: ${active.title}`
      : current
        ? reading
          ? "הרב קורא"
          : "הרב מסביר את המשפט המסומן"
        : "השיעור מתחיל";

  const zohar = (
    <section style={styles.zohar} aria-label="טקסט הזוהר">
      {/* בטלפון הסרטון מוצמד למעלה, אז שורת המצב לא נדבקת מתחתיו */}
      <div style={{ ...styles.status, ...(wide ? null : { position: "static" }) }} aria-live="polite">
        <span style={{ ...styles.dot, background: playing ? "#c0392b" : "#9aa3b2" }} />
        {status}
      </div>
      <p className={book.className} style={{ ...styles.zoharText, fontSize: textSize + 3 }}>
        {passage.sentences.map((s, i) => {
          const isCurrent = i === currentSi && !active;
          const isCurrentDim = i === currentSi && active; // הרב באמצע מקור אחר - מסמנים בעדינות איפה עצרנו
          const before = i < lessonStart;
          const t = firstRead.get(i);
          return (
            <span
              key={i}
              ref={(el) => (sentenceRefs.current[i] = el)}
              onClick={t != null ? () => jump(t) : undefined}
              title={t != null ? `הרב קרא משפט זה ב-${formatTime(t)} (לחצו לשמוע)` : undefined}
              style={{
                ...styles.sentence,
                ...(t != null ? styles.clickable : null),
                ...(before ? styles.before : null),
                ...(isCurrent ? (reading ? styles.marker : styles.markerExplain) : null),
                ...(isCurrentDim ? styles.markerDim : null),
              }}
            >
              {s}{" "}
            </span>
          );
        })}
      </p>
      {lessonStart > 0 && <p style={styles.hint}>החלק המעומעם בתחילת הקטע נלמד בשיעור הקודם.</p>}
    </section>
  );

  /* --- המקור שהרב מביא --- */
  const sourceCard = (s, live) => (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        {live && <span style={styles.live}>● עכשיו בשיעור</span>}
        <button type="button" style={styles.time} onClick={() => jump(s.start)}>
          ▶ {formatTime(s.start)}
          {s.end ? `–${formatTime(s.end)}` : ""}
        </button>
      </div>
      <div style={styles.cardTitle}>{s.title}</div>
      {s.he && (
        <div style={styles.ref}>
          {s.link ? (
            <a href={s.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
              {s.he}
            </a>
          ) : (
            s.he
          )}
        </div>
      )}
      {live && s.end && (
        <div style={styles.progress} aria-hidden="true">
          <div style={{ ...styles.progressFill, width: `${Math.min(100, ((now - s.start) / (s.end - s.start)) * 100)}%` }} />
        </div>
      )}
      {s.segments ? (
        // רק הטקסט נגלל (אל המשפט שהרב קורא) - הכותרת נשארת במקום
        <p
          ref={live ? panelRef : undefined}
          className={book.className}
          style={{ ...styles.sourceText, ...(live ? (wide ? styles.sourceScroll : styles.sourceScrollNarrow) : null), fontSize: textSize + 1 }}
        >
          {s.segments.map((seg, i) => (
            <span
              key={i}
              ref={live ? (el) => (segmentRefs.current[i] = el) : undefined}
              style={live && i === activeSeg ? styles.marker : undefined}
            >
              {seg}{" "}
            </span>
          ))}
        </p>
      ) : (
        s.text && (
          <p className={book.className} style={{ ...styles.sourceText, fontSize: textSize + 1 }}>
            {s.text}
          </p>
        )
      )}
      {s.note && <div style={styles.note}>{s.note}</div>}
    </div>
  );

  const pastList = past.length > 0 && (
    <div style={styles.past}>
      <div style={styles.pastTitle}>מקורות קודמים בשיעור ({past.length})</div>
      {past.map((s, i) => (
        <div key={i}>
          <button
            type="button"
            style={styles.pastItem}
            onClick={() => setOpenPast(openPast === s ? null : s)}
            aria-expanded={openPast === s}
          >
            <span style={styles.pastTime}>{formatTime(s.start)}</span>
            <span>{s.title}</span>
          </button>
          {openPast === s && sourceCard(s, false)}
        </div>
      ))}
    </div>
  );

  const panel = (
    <div style={wide ? styles.panelWide : styles.panelNarrow}>
      {active ? sourceCard(active, true) : wide && <p style={styles.empty}>כשהרב יביא מקור נוסף, הוא יופיע כאן.</p>}
      {pastList}
    </div>
  );

  const backButton = !follow && playing && (
    <button type="button" style={{ ...styles.back, bottom: wide ? 24 : sheetOpen && (active || past.length) ? "46vh" : 70 }} onClick={() => setFollow(true)}>
      ↓ חזרה לרב
    </button>
  );

  if (wide) {
    return (
      <div style={styles.grid}>
        {zohar}
        <aside style={styles.side}>
          <div style={styles.videoBox}>{video}</div>
          {panel}
        </aside>
        {backButton}
      </div>
    );
  }

  return (
    <div>
      <div style={styles.videoSticky}>{video}</div>
      {zohar}
      {(active || past.length > 0) && (
        <div style={styles.sheet}>
          <button type="button" style={styles.sheetHandle} onClick={() => setSheetOpen(!sheetOpen)} aria-expanded={sheetOpen}>
            {active ? `📜 הרב מביא: ${active.title}` : `📜 מקורות קודמים (${past.length})`}
            <span>{sheetOpen ? "▾" : "▴"}</span>
          </button>
          {sheetOpen && panel}
        </div>
      )}
      {backButton}
    </div>
  );
}

const MARKER = "#fde68a"; // צבע של מרקר צהוב על דף

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 440px)",
    gap: 28,
    alignItems: "start",
  },
  side: {
    position: "sticky",
    top: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    maxHeight: "calc(100vh - 32px)",
    minWidth: 0,
  },
  videoBox: { flexShrink: 0 },
  videoSticky: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#f7f7f7",
    paddingBottom: 4,
  },
  zohar: {
    background: "#fffdf7",
    border: "1px solid #ece6d6",
    borderRadius: 14,
    padding: "18px 22px 28px",
    minWidth: 0,
  },
  status: {
    position: "sticky",
    top: 0,
    background: "#fffdf7",
    padding: "8px 0 12px",
    marginBottom: 6,
    borderBottom: "1px solid #ece6d6",
    fontSize: 14,
    color: "#5d6675",
    display: "flex",
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  zoharText: {
    margin: 0,
    lineHeight: 2.1,
    color: "#1b2433",
  },
  sentence: {
    borderRadius: 4,
    transition: "background-color .4s",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
    padding: "2px 0",
  },
  clickable: { cursor: "pointer" },
  before: { opacity: 0.4 },
  marker: { background: MARKER },
  markerExplain: { background: MARKER, boxShadow: "inset 0 -3px 0 #d97706" },
  markerDim: { background: "#fdf3c7" },
  hint: { fontSize: 13, color: "#8a919e", margin: "14px 0 0" },

  panelWide: {
    overflowY: "auto",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    paddingBottom: 8,
  },
  panelNarrow: {
    overflowY: "auto",
    maxHeight: "36vh",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "0 14px 14px",
  },
  empty: {
    margin: 0,
    padding: 16,
    border: "1px dashed #ccd3df",
    borderRadius: 12,
    color: "#8a919e",
    fontSize: 14,
  },
  card: {
    background: "#fff",
    border: "1px solid #e3e6ec",
    borderRight: "4px solid #0a3a75",
    borderRadius: 12,
    padding: 14,
    display: "grid",
    gap: 6,
  },
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  live: { color: "#c0392b", fontSize: 13, fontWeight: 700 },
  time: {
    border: "none",
    background: "#e7edf6",
    color: "#0a3a75",
    borderRadius: 8,
    padding: "3px 9px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    direction: "ltr",
    fontVariantNumeric: "tabular-nums",
    marginInlineStart: "auto",
  },
  cardTitle: { fontWeight: 700, fontSize: 16 },
  ref: { fontSize: 13, color: "#5d6675" },
  link: { color: "#1b73c0" },
  progress: { height: 4, background: "#e7edf6", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", background: "#0a3a75", transition: "width .5s linear" },
  sourceText: { margin: 0, lineHeight: 1.95, overflowWrap: "anywhere" },
  sourceScroll: { maxHeight: "min(46vh, 420px)", overflowY: "auto", paddingLeft: 6 },
  // בטלפון החלונית קטנה יותר - כדי שיישאר מקום לזוהר בין הסרטון לחלונית
  sourceScrollNarrow: { maxHeight: "18vh", overflowY: "auto", paddingLeft: 6 },
  note: { fontSize: 13, color: "#5d6675" },
  past: { display: "grid", gap: 4 },
  pastTitle: { fontSize: 13, fontWeight: 700, color: "#5d6675", marginBottom: 2 },
  pastItem: {
    display: "flex",
    gap: 10,
    alignItems: "baseline",
    width: "100%",
    textAlign: "right",
    background: "none",
    border: "none",
    borderBottom: "1px solid #eef0f4",
    padding: "7px 2px",
    fontSize: 14,
    cursor: "pointer",
    color: "#1b2433",
  },
  pastTime: { color: "#0a3a75", fontWeight: 700, fontVariantNumeric: "tabular-nums", direction: "ltr", minWidth: 40 },

  sheet: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 60,
    background: "#fff",
    borderTop: "1px solid #e3e6ec",
    borderRadius: "16px 16px 0 0",
    boxShadow: "0 -6px 24px rgba(0,0,0,0.12)",
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  },
  sheetHandle: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    padding: "12px 16px",
    fontSize: 15,
    fontWeight: 700,
    color: "#0a3a75",
    cursor: "pointer",
    textAlign: "right",
  },
  back: {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 70,
    background: "#0a3a75",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 15,
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    cursor: "pointer",
  },
};
