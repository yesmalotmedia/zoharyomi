/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const whatsappLink =
    process.env.NEXT_PUBLIC_WHATSAPP_LINK ||
    "https://chat.whatsapp.com/Jho0f5IWHZW3rFzWu5s1X9";

  // לזהות מובייל
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <nav style={styles.nav}>
        {/* לוגו */}
        <div style={styles.logoBox}>
          <Link href="/">
            <Image
              src="/zoharlogo.png"
              alt="לוגו"
              width={44}
              height={44}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>

        {/* כותרת במובייל בלבד */}
        {isMobile && <span style={styles.mobileTitle}>הלימוד היומי בזוהר</span>}

        {/* דסקטופ */}
        {!isMobile && (
          <div style={styles.desktopRow}>
            <span style={styles.title}>הלימוד היומי בזוהר</span>

            <div style={styles.menuDesktop}>
              <NavLink href="/shiur/iyun">שיעורי עיון</NavLink>
              <NavLink href="/shiur/pshat">שיעורי פשט</NavLink>
              <NavLink href="/about">אודות</NavLink>

              <a
                href={whatsappLink}
                target="_blank"
                style={styles.whatsappDesktop}
              >
                <FaWhatsapp size={18} style={{ marginLeft: 6 }} />
                הצטרפו ללימוד היומי
              </a>
            </div>
          </div>
        )}

        {/* כפתור תפריט למובייל */}
        {isMobile && (
          <button style={styles.burger} onClick={() => setOpen(true)}>
            <FaBars size={22} color="white" />
          </button>
        )}
      </nav>

      {/* ===== MOBILE SLIDE MENU ===== */}
      {isMobile && (
        <>
          <div
            style={{
              ...styles.mobileMenu,
              transform: open ? "translateX(0%)" : "translateX(-100%)",
            }}
          >
            {/* כפתור סגירה */}
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>
              <FaTimes size={26} color="white" />
            </button>

            <div style={styles.mobileLinks}>
              <NavLink href="/shiur/iyun" onClick={() => setOpen(false)}>
                שיעורים בעיון
              </NavLink>
              <NavLink href="/shiur/pshat" onClick={() => setOpen(false)}>
                שיעורים קצרים
              </NavLink>
              <NavLink href="/about" onClick={() => setOpen(false)}>
                אודות
              </NavLink>

              <a
                href={whatsappLink}
                target="_blank"
                onClick={() => setOpen(false)}
                style={styles.whatsappMobile}
              >
                <FaWhatsapp size={20} style={{ marginLeft: 8 }} />
                הצטרפו ללימוד היומי
              </a>
            </div>
          </div>

          {/* רקע חשוך */}
          {open && (
            <div style={styles.backdrop} onClick={() => setOpen(false)} />
          )}
        </>
      )}
    </>
  );
}

/* קומפוננטת לינק */
function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        color: "white",
        fontSize: "1.05rem",
        textDecoration: "none",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Link>
  );
}

/* =============== STYLES =============== */

const styles = {
  nav: {
    width: "100%",
    background: "linear-gradient(to right bottom, #0a3a75, #1b73c0)",
    borderBottom: "4px solid #e8b84c",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    direction: "rtl",
    color: "white",
    boxSizing: "border-box",
    justifyContent: "space-between",
    position: "relative",
  },

  logoBox: {
    display: "flex",
    alignItems: "center",
  },

  mobileTitle: {
    position: "absolute",
    right: "50%",
    transform: "translateX(50%)",
    fontSize: "1.25rem",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  desktopRow: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },

  title: {
    fontSize: "1.4rem",
    fontWeight: 700,
  },

  menuDesktop: {
    display: "flex",
    gap: 24,
    alignItems: "center",
  },

  whatsappDesktop: {
    background: "#22c35e",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 600,
  },

  burger: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  mobileMenu: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "75%",
    maxWidth: 280,
    height: "100vh",
    background: "linear-gradient(to bottom, #0a3a75, #1b73c0)",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    zIndex: 999,
    transition: "transform 0.3s ease",
    boxSizing: "border-box",
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  mobileLinks: {
    marginTop: 70,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  whatsappMobile: {
    background: "#22c35e",
    color: "white",
    padding: "10px 18px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.35)",
    zIndex: 998,
  },
};
