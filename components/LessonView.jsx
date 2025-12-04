"use client";

import { useState, useEffect, useRef } from "react";

export default function LessonView({ item }) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("both");

  // האם הווידאו במצב צף
  const [isFloating, setIsFloating] = useState(false);

  // ref לווידאו הגדול בעמוד
  const videoRef = useRef(null);

  /* ------------------------ בדיקת מובייל ------------------------ */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ------------------------ מנגנון וידאו צף ------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY;

      // כניסה למצב צף
      if (!isFloating && scroll > 350) {
        setIsFloating(true);
      }

      // חזרה למצב רגיל
      if (isFloating && scroll < 100) {
        setIsFloating(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFloating]);

  /* ------------------------ המרה ל-YouTube Embed ------------------------ */
  function convertToEmbed(url) {
    try {
      let id = "";
      if (url.includes("youtu.be")) {
        id = url.split("youtu.be/")[1].split("?")[0];
      } else {
        id = new URL(url).searchParams.get("v");
      }
      return id
        ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&showinfo=0&color=white`
        : "";
    } catch {
      return "";
    }
  }

  const videoNode = item?.youtube?.nodes?.find((n) => n.type === "VIDEO");
  const videoUrl = videoNode?.videoData?.video?.src?.url ?? "";

  /* ------------------------ רנדור ------------------------ */
  return (
    <div style={styles.container}>
      {/* פרטים על השיעור */}
      <div style={styles.details}>
        פרשת {item.parasha} • דף {item.daf} עמוד {item.page} • פסקה {item.par}
      </div>

      {/* סרטון יוטיוב */}
      {videoUrl && (
        <div
          ref={videoRef}
          style={isFloating ? styles.floatingVideoWrapper : styles.videoWrapper}
          onClick={() =>
            isFloating && window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <iframe
            style={styles.video}
            src={convertToEmbed(videoUrl)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* כפתורי מצבי צפייה */}
      <div style={styles.modeButtons}>
        <button
          onClick={() => setViewMode("he")}
          style={{
            ...styles.modeBtn,
            background: viewMode === "he" ? "#0a3a75" : "#eee",
            color: viewMode === "he" ? "white" : "black",
          }}
        >
          עברית
        </button>

        <button
          onClick={() => setViewMode("ar")}
          style={{
            ...styles.modeBtn,
            background: viewMode === "ar" ? "#0a3a75" : "#eee",
            color: viewMode === "ar" ? "white" : "black",
          }}
        >
          ארמית
        </button>

        <button
          onClick={() => setViewMode("both")}
          style={{
            ...styles.modeBtn,
            background: viewMode === "both" ? "#0a3a75" : "#eee",
            color: viewMode === "both" ? "white" : "black",
          }}
        >
          משולב
        </button>
      </div>

      {/* תוכן בעברית/ארמית */}
      <div
        style={{
          ...styles.columnsWrapper,
          flexDirection:
            viewMode === "both" ? (isMobile ? "column" : "row") : "column",
        }}
      >
        {(viewMode === "he" || viewMode === "both") && (
          <div style={styles.column}>
            <h3 style={styles.sectionTitle}>עברית</h3>
            <p style={styles.text}>{item.hebrew}</p>
          </div>
        )}

        {(viewMode === "ar" || viewMode === "both") && (
          <div style={styles.column}>
            <h3 style={styles.sectionTitle}>ארמית</h3>
            <p style={styles.text}>{item.aramit}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */
const styles = {
  container: {
    direction: "rtl",
    padding: 20,
    maxWidth: 900,
    margin: "0 auto",
    fontFamily: "sans-serif",
    marginBottom: 200,
  },

  details: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 600,
    color: "#0a3a75",
  },

  /* מצב רגיל */
  videoWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // 16:9
    height: 0,
    marginBottom: 20,
    overflow: "hidden",
    borderRadius: 12,
    background: "#000",
    transition: "all 0.1s ease",
  },

  /* מצב צף */
  floatingVideoWrapper: {
    position: "fixed",
    width: "300px",
    height: "168px", // 16:9
    bottom: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    cursor: "pointer",
    transition: "all 0.s ease",
  },

  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  modeButtons: {
    display: "flex",
    gap: 10,
    marginBottom: 25,
  },

  modeBtn: {
    flex: 1,
    padding: "10px 15px",
    fontSize: 16,
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },

  columnsWrapper: {
    display: "flex",
    gap: 20,
  },

  column: {
    flex: 1,
    background: "#f8f8f8",
    padding: 20,
    borderRadius: 12,
  },

  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: "#0a3a75",
  },

  text: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.9,
    fontSize: 17,
  },
};
