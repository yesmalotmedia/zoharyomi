"use client";

import { useState } from "react";
import { FaShareAlt } from "react-icons/fa";

/* שיתוף השיעור - בטלפון נפתחת חלונית השיתוף של המכשיר (וואטסאפ וכו'),
   ובמחשב שאין בו שיתוף - הקישור מועתק */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {} // המשתמש סגר את החלונית
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("העתיקו את הקישור:", url);
    }
  };

  return (
    <button type="button" onClick={share} style={styles.button}>
      <FaShareAlt size={14} />
      {copied ? "הקישור הועתק" : "שיתוף"}
    </button>
  );
}

const styles = {
  button: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 20,
    border: "1px solid #d0d8e8",
    background: "white",
    color: "#0a3a75",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
};
