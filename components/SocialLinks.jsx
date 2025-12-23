"use client";

import { FaYoutube, FaSpotify, FaWhatsapp } from "react-icons/fa";

export default function SocialLinks({ size = 22, gap = 14 }) {
  const links = {
    youtube: "https://www.youtube.com/channel/UCrWDhDGWajXJ3YX2pMWj1mw",
    spotify:
      "https://open.spotify.com/show/2hL7TxOFEqHErFOLcDUr0E?si=r7W-zXswTMiYo106I6dttA",
    whatsapp: "https://chat.whatsapp.com/Jho0f5IWHZW3rFzWu5s1X9",
  };

  return (
    <div style={{ ...styles.wrapper, gap }}>
      <a
        href={links.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <FaYoutube size={size} style={styles.icon} />
      </a>

      <a
        href={links.spotify}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Spotify"
      >
        <FaSpotify size={size} style={styles.icon} />
      </a>

      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={size} style={styles.icon} />
      </a>
    </div>
  );
}

/* ===== styles ===== */

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    color: "white",
    cursor: "pointer",
    transition: "opacity 0.15s ease",
  },
};
