export default function PshatPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>שיעורים קצרים</h1>

        <p style={styles.text}>
          בקרוב בעז"ה נעלה לכאן את השיעורים הקצרים — שיעורי פשט תמציתיים, ברורים
          ובהירים המיועדים ללימוד יומי קצר ומחזק.
        </p>

        <p style={styles.text}>
          אנו עובדים על העלאת התכנים ממש בימים אלו. מוזמנים כבר עכשיו להצטרף
          לקבוצת הוואטסאפ ולקבל עדכון כשזה יעלה.
        </p>

        <a
          href={process.env.NEXT_PUBLIC_WHATSAPP_LINK}
          target="_blank"
          style={styles.whatsapp}
        >
          הצטרפו לקבוצה
        </a>
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
    maxWidth: "700px",
    background: "white",
    padding: "35px 30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    fontSize: "34px",
    fontWeight: 800,
    marginBottom: "25px",
    color: "#0a3a75",
  },

  text: {
    fontSize: "19px",
    lineHeight: 1.9,
    marginBottom: "20px",
    color: "#333",
  },

  whatsapp: {
    display: "inline-block",
    marginTop: 20,
    background: "#25D366",
    color: "white",
    padding: "12px 28px",
    borderRadius: 50,
    fontSize: 18,
    textDecoration: "none",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
    transition: "0.2s",
  },
};
