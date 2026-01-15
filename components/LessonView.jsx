"use client";

import { useState, useEffect, useRef } from "react";

export default function LessonView({ item, type }) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("both");
  const [isFloating, setIsFloating] = useState(false);

  const videoRef = useRef(null);

  /* ------------------------ בדיקת מובייל ------------------------ */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ------------------------ וידאו צף ------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY;
      if (!isFloating && scroll > 350) setIsFloating(true);
      if (isFloating && scroll < 100) setIsFloating(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFloating]);

  /* ------------------------ YouTube embed ------------------------ */
  function convertToEmbed(url) {
    try {
      let id = "";
      if (url.includes("youtu.be")) {
        id = url.split("youtu.be/")[1].split("?")[0];
      } else {
        id = new URL(url).searchParams.get("v");
      }
      return id ? `https://www.youtube.com/embed/${id}?rel=0` : "";
    } catch {
      return "";
    }
  }

  const videoNode = item?.youtube?.nodes?.find((n) => n.type === "VIDEO");
  const videoUrl = videoNode?.videoData?.video?.src?.url ?? "";

  /* ------------------------ רנדור ------------------------ */
  return (
    <div style={styles.container}>
      {/* פרטי השיעור */}
      <div style={styles.details}>
        פרשת {item.parasha} • דף {item.daf} עמוד {item.page}
        {item.par && <> • פסקה {item.par}</>}
      </div>

      {/* ניווט */}
      <div style={styles.navWrapper}>
        <a href={`/shiur/${type}/${item.pageid - 1}`} style={styles.navButton}>
          → שיעור קודם
        </a>
        <a
          href={`/shiur/${type}/${item.pageid + 1}`}
          style={{ ...styles.navButton, ...styles.nextButton }}
        >
          שיעור הבא ←
        </a>
      </div>

      {/* וידאו */}
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

      {/* כפתורי מצבים */}
      <div style={styles.modeButtons}>
        {["he", "ar", "both", "sources"].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              ...styles.modeBtn,
              background: viewMode === mode ? "#0a3a75" : "#eee",
              color: viewMode === mode ? "white" : "black",
            }}
          >
            {mode === "he" && "עברית"}
            {mode === "ar" && "ארמית"}
            {mode === "both" && "משולב"}
            {mode === "sources" && "דפי מקורות"}
          </button>
        ))}
      </div>

      {/* אזור תוכן */}
      {viewMode !== "sources" && (
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
      )}

      {/* דפי מקורות – במקום הטקסט */}
      {/* {viewMode === "sources" && item?.sources?.length > 0 && (
        <div style={styles.sourcesWrapper}>
          {item.sources
            .sort((a, b) => a.order - b.order)
            .map((page, i) => (
              <img
                key={i}
                src={page.imageUrl}
                alt={`דף מקורות ${i + 1}`}
                style={styles.sourcePage}
                loading="lazy"
              />
            ))}
        </div>
      )} */}

      {/* דפי מקורות – במקום הטקסט */}
      {viewMode === "sources" && (
        <div style={styles.sourcesWrapper}>
          <iframe
            src={item.sources}
            title="דף מקורות"
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            }}
            loading="lazy"
          />
        </div>
      )}
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

  videoWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
  },

  floatingVideoWrapper: {
    position: "fixed",
    width: 300,
    height: 168,
    bottom: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    cursor: "pointer",
  },

  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  modeButtons: {
    display: "flex",
    gap: 10,
    marginBottom: 25,
    flexWrap: "wrap",
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

  navWrapper: {
    display: "flex",
    gap: 12,
    marginBottom: 30,
    flexWrap: "wrap",
  },

  navButton: {
    flex: 1,
    textAlign: "center",
    padding: "12px 16px",
    borderRadius: 12,
    background: "#f0f4fa",
    color: "#0a3a75",
    fontSize: 16,
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid #d0d8e8",
  },

  nextButton: {
    background: "#0a3a75",
    color: "white",
    border: "1px solid #0a3a75",
  },

  /* דפי מקורות */
  sourcesWrapper: {
    maxWidth: 800,
    margin: "0 auto",
  },

  sourcePage: {
    width: "100%",
    marginBottom: 32,
    background: "white",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  },
};
