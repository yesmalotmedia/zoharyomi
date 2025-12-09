"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaBookOpen, FaClock, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const whatsappLink =
    process.env.NEXT_PUBLIC_WHATSAPP_LINK ||
    "https://chat.whatsapp.com/Jho0f5IWHZW3rFzWu5s1X9";

  // לזהות מובייל אמיתי
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // אנימציות
  useEffect(() => {
    setTimeout(() => setStage(1), 200);
    setTimeout(() => setStage(2), 600);
    setTimeout(() => setStage(3), 1100);
    setTimeout(() => setStage(4), 1700);
  }, []);

  return (
    <div style={styles.hero}>
      <div style={styles.centerBlock}>
        {/* לוגו + כותרת יחד */}
        <div
          style={{
            ...styles.fadeItem,
            ...styles.logoTitleWrapper(isMobile),
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <Image
            src="/zoharlogo.png"
            alt="לוגו"
            width={isMobile ? 80 : 110}
            height={isMobile ? 80 : 110}
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))",
            }}
          />

          <h1
            style={{
              ...styles.fadeItem,
              ...styles.title(isMobile),
              opacity: stage >= 2 ? 1 : 0,
            }}
          >
            הלימוד היומי בזוהר
          </h1>
        </div>

        {/* תפריט */}
        <div
          style={{
            ...styles.fadeItem,
            ...styles.menu(isMobile),
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(18px)",
          }}
        >
          <MenuItem
            href="/shiur/iyun"
            icon={<FaBookOpen size={32} color="white" />}
            label="שיעורי עיון"
            mobile={isMobile}
          />

          <MenuItem
            href="/shiur/pshat"
            icon={<FaClock size={32} color="white" />}
            label="שיעורי פשט "
            mobile={isMobile}
          />

          <MenuItem
            href="/about"
            icon={<FaInfoCircle size={32} color="white" />}
            label="אודות"
            mobile={isMobile}
          />
        </div>

        {/* וואטסאפ */}
        <div
          style={{
            ...styles.fadeItem,
            ...styles.whatsappWrapper,
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <a
            href={whatsappLink}
            target="_blank"
            style={styles.whatsapp(isMobile)}
          >
            <FaWhatsapp size={26} style={{ marginLeft: 8 }} />
            הצטרפו ללימוד היומי
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================= */
/*     קומפוננטת תפריט      */
/* ========================= */

function MenuItem({ href, icon, label, mobile }) {
  return (
    <Link href={href} style={styles.menuItemWrapper(mobile)}>
      <div style={styles.menuIcon}>{icon}</div>
      <div style={styles.menuItem}>{label}</div>
    </Link>
  );
}

/* ========================= */
/*           STYLES          */
/* ========================= */

const styles = {
  hero: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(to bottom right, #0a3a75, #1b73c0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    textAlign: "center",
    padding: 20,
  },

  centerBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: 700,
  },

  // ⬅ רווח קטן בין לוגו לכותרת ורווח גדול כלפי מטה
  logoTitleWrapper: (mobile) => ({
    display: "flex",
    flexDirection: mobile ? "column" : "row",
    alignItems: "center",
    gap: mobile ? 6 : 10,
    marginBottom: mobile ? 25 : 45,
  }),

  title: (mobile) => ({
    fontSize: mobile ? 32 : 46,
    fontWeight: 800,
    color: "white",
    textShadow: "0 3px 10px rgba(0,0,0,0.3)",
  }),

  menu: (mobile) => ({
    display: "flex",
    flexDirection: mobile ? "column" : "row",
    gap: mobile ? 20 : 38,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  }),

  menuItemWrapper: (mobile) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    cursor: "pointer",
    width: mobile ? "100%" : "auto",
  }),

  menuIcon: {
    marginBottom: 8,
  },

  menuItem: {
    color: "white",
    fontSize: 20,
    background: "rgba(255,255,255,0.12)",
    padding: "10px 18px",
    borderRadius: 10,
    width: "100%",
    textAlign: "center",
  },

  whatsappWrapper: {
    marginTop: 20,
  },

  whatsapp: (mobile) => ({
    background: "rgba(37,211,102,0.95)",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: mobile ? "12px 20px" : "12px 26px",
    borderRadius: 50,
    fontSize: mobile ? 18 : 20,
    boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
    transition: "0.1s",
  }),
  fadeItem: {
    transition: "opacity 0.7s ease, transform 0.7s ease",
  },
};
