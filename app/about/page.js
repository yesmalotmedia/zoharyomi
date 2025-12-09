/* eslint-disable react/no-unescaped-entities */
"use client";

export default function AboutPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>אודות הלימוד היומי בזוהר</h1>

        <p style={styles.text}>
          בעקבות המלחמה ולקידום גאולת ישראל ברחמים התעוררנו לייסד את לימוד{" "}
          <strong>העמוד היומי בזוהר הקדוש</strong>, ממש כפי שייסד לפני כמאה שנה
          המהר"ם שפירא את לימוד הדף היומי.
        </p>

        <p style={styles.text}>
          במסגרת המיזם אנו פועלים להפיץ את אור הזוהר בעוצמה גדולה — בבתי כנסת,
          במדרשות, בישיבות, ובכל מקום שבו יהודים מחפשים להתחזק ולגלות עומק
          ורעננות בחיבור שלהם לתורה.
        </p>

        <p style={styles.text}>
          מי שמעוניין להצטרף ללימוד מוזמן להצטרף לקבוצה שבה נשלח בלנ״ד שיעור
          יומי של הרב <strong>יהושע ויצמן שליט״א</strong>, ראש ישיבת ההסדר מעלות
          ויו״ר מרכז ישיבות ואולפנות בני עקיבא.
        </p>

        <div style={styles.whatsappBox}>
          <a
            href={process.env.NEXT_PUBLIC_WHATSAPP_LINK}
            target="_blank"
            style={styles.whatsappLink}
          >
            להצטרפות ללימוד היומי{" "}
          </a>
        </div>

        <p style={styles.text}>
          אנו קוראים לכל מי שיכול לארגן שיעורים, חברותות ומעגלי לימוד — שיעשה
          זאת. כל הצטרפות היא נדבך נוסף בבניין אדיר של לימוד תורה ופנימיות
          בישראל.
        </p>

        <p style={styles.text}>
          מוזמנים לשתף את הקישור עם חברים נוספים המעוניינים להצטרף ללימוד ולזכות
          רבים.
        </p>
      </div>
    </div>
  );
}

/* ====================== */
/*         STYLES         */
/* ====================== */

const styles = {
  container: {
    direction: "rtl",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    maxWidth: "850px",
    background: "white",
    padding: "35px 30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "36px",
    fontWeight: 800,
    marginBottom: "25px",
    color: "#0a3a75",
    textAlign: "center",
  },

  text: {
    fontSize: "19px",
    lineHeight: 1.9,
    marginBottom: "18px",
    color: "#333",
  },

  whatsappBox: {
    textAlign: "center",
    margin: "30px 0",
  },

  whatsappLink: {
    display: "inline-block",
    background: "#25D366",
    padding: "12px 26px",
    borderRadius: "50px",
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
    transition: "0.25s",
  },

  "@media (max-width: 768px)": {
    title: {
      fontSize: "28px",
    },
    text: {
      fontSize: "17px",
    },
  },
};
