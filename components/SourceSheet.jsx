"use client";

/* דף המקורות של השיעור - המקורות שהרב הביא, לפי סדר הופעתם בשיעור.
   לחיצה על הזמן מקפיצה את הסרטון (onSeek) לרגע שבו המקור נאמר. */

const formatTime = (sec) =>
  `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const STATUS = {
  likely: "לבדיקה",
};

export default function SourceSheet({ sheet, onSeek }) {
  if (!sheet?.length) return null;
  const sources = sheet.filter((s) => s.status !== "mentioned");
  const mentioned = sheet.filter((s) => s.status === "mentioned");

  const TimeButton = ({ s }) => (
    <button
      type="button"
      onClick={() => onSeek(s.start)}
      style={styles.time}
      aria-label={`מעבר לדקה ${formatTime(s.start)} בשיעור`}
    >
      ▶ {formatTime(s.start)}
      {s.end && <span style={styles.timeEnd}>–{formatTime(s.end)}</span>}
    </button>
  );

  return (
    <section style={styles.wrap} aria-labelledby="sheet-title">
      <h2 id="sheet-title" style={styles.title}>
        מקורות שהרב הביא בשיעור
      </h2>

      <ol style={styles.list}>
        {sources.map((s, i) => (
          <li key={i} style={styles.item}>
            <div style={styles.head}>
              <TimeButton s={s} />
              <span style={styles.name}>{s.title}</span>
              {STATUS[s.status] && <span style={styles.badge}>{STATUS[s.status]}</span>}
            </div>
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
            {s.text && <p style={styles.text}>{s.text}</p>}
            {s.note && <div style={styles.note}>{s.note}</div>}
          </li>
        ))}
      </ol>

      {mentioned.length > 0 && (
        <>
          <h3 style={styles.subtitle}>הוזכרו בשיעור</h3>
          <ul style={styles.mentioned}>
            {mentioned.map((s, i) => (
              <li key={i} style={styles.mentionedItem}>
                <TimeButton s={s} />
                <span>
                  {s.title}
                  {s.note && <span style={styles.note}> · {s.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div style={styles.foot}>הטקסטים מתוך ספריא (sefaria.org.il) ואוצריא</div>
    </section>
  );
}

const styles = {
  wrap: {
    marginTop: 40,
    background: "#fff",
    border: "1px solid #e3e6ec",
    borderRadius: 14,
    padding: "24px 20px",
  },
  title: {
    fontSize: 22,
    color: "#0a3a75",
    margin: "0 0 18px",
  },
  subtitle: {
    fontSize: 18,
    color: "#0a3a75",
    margin: "28px 0 12px",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: 22,
  },
  item: {
    display: "grid",
    gap: 6,
    paddingBottom: 18,
    borderBottom: "1px solid #eef0f4",
  },
  head: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  time: {
    border: "none",
    background: "#e7edf6",
    color: "#0a3a75",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontVariantNumeric: "tabular-nums",
    direction: "ltr",
  },
  timeEnd: {
    fontWeight: 400,
  },
  name: {
    fontWeight: 700,
    fontSize: 17,
  },
  badge: {
    fontSize: 12,
    background: "#fbf0dc",
    color: "#8a5a00",
    borderRadius: 999,
    padding: "1px 9px",
  },
  ref: {
    fontSize: 14,
    color: "#5d6675",
  },
  link: {
    color: "#1b73c0",
  },
  text: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.9,
    borderRight: "3px solid #e3e6ec",
    paddingRight: 12,
    overflowWrap: "anywhere",
  },
  note: {
    fontSize: 14,
    color: "#5d6675",
  },
  mentioned: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: 10,
  },
  mentionedItem: {
    display: "flex",
    alignItems: "baseline",
    gap: 10,
    flexWrap: "wrap",
  },
  foot: {
    marginTop: 24,
    fontSize: 13,
    color: "#8a919e",
  },
};
