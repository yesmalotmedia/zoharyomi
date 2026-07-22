"use client";

import { useState, useEffect, useRef } from "react";

/* מימדי החלון הצף בדסקטופ (40% גדול יותר מהגודל המקורי 300x168) */
const FLOAT_WIDTH_DESKTOP = 420; // 300 * 1.4
const FLOAT_HEIGHT_DESKTOP = 235; // 168 * 1.4
const FLOAT_MARGIN = 20;
const MOBILE_BREAKPOINT = 480; // טלפון בלבד - חלונות קטנים בדסקטופ לא נכללים
const MOBILE_FLOAT_SIDE_MARGIN = 10;

/* חישוב גודל החלון הצף לפי רוחב viewport:
   - דסקטופ/חלון רחב (≥768): 420×235 בפינה
   - חלון ביניים (480–767): גודל קטן בפינה, לא רוחב מלא
   - מובייל (<480): רוחב מלא עם שוליים, מוצמד לתחתית */
function computeFloatSize(viewportWidth) {
  if (viewportWidth >= 768) {
    return {
      width: FLOAT_WIDTH_DESKTOP,
      height: FLOAT_HEIGHT_DESKTOP,
      anchor: "corner",
    };
  }
  if (viewportWidth >= MOBILE_BREAKPOINT) {
    return { width: 280, height: 158, anchor: "corner" };
  }
  const width = Math.max(200, viewportWidth - MOBILE_FLOAT_SIDE_MARGIN * 2);
  const height = Math.round((width * 9) / 16);
  return { width, height, anchor: "bottom" };
}

export default function LessonView({ item, type }) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("both");
  const [isFloating, setIsFloating] = useState(false);

  // מיקום החלון הצף - נשמר בין הצפות (ברירת מחדל: פינה ימנית תחתונה)
  const [floatPos, setFloatPos] = useState(null);

  // גודל החלון הצף - מחושב לפי רוחב המסך כדי שיתאים גם למובייל
  // (מתחיל בגודל דסקטופ קבוע כדי שהרינדור הראשון יהיה זהה בשרת ובלקוח;
  //  מתעדכן בפועל ב-useEffect הראשון, לפני שהחלון הצף אי פעם מוצג)
  const [floatSize, setFloatSize] = useState({
    width: FLOAT_WIDTH_DESKTOP,
    height: FLOAT_HEIGHT_DESKTOP,
    anchor: "corner",
  });

  const videoRef = useRef(null);
  const dragInfoRef = useRef(null); // { startX, startY, originLeft, originTop, moved }
  const justDraggedRef = useRef(false); // true ממש אחרי גרירה, כדי לבטל את ה-click הבא
  const [isDragging, setIsDragging] = useState(false);

  // האם הסרטון "הופעל" - לפני זה מציגים תמונת תצוגה משלנו וכפתור play משלנו,
  // ורק בלחיצה עליו טוענים בפועל את ה-iframe (עם autoplay). כך המשתמש אף פעם
  // לא לוחץ על כפתור ה-play המקורי של יוטיוב (זה שגורם בפועל לניווט/לפתיחת
  // האפליקציה במובייל) - הוא לוחץ רק על האלמנט שלנו.
  const [playing, setPlaying] = useState(false);

  /* ------------------------ בדיקת מובייל + גודל החלון הצף ------------------------ */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < MOBILE_BREAKPOINT);
      setFloatSize(computeFloatSize(w));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* כשגודל החלון הצף משתנה (למשל סיבוב מסך) - נדאג שהמיקום הקודם עדיין בתוך המסך */
  useEffect(() => {
    setFloatPos((prev) => (prev ? clampPos(prev.left, prev.top) : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floatSize]);

  /* ------------------------ מיקום ברירת מחדל לחלון הצף ------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    setFloatPos(
      (prev) =>
        prev ?? {
          left: window.innerWidth - floatSize.width - FLOAT_MARGIN,
          top: window.innerHeight - floatSize.height - FLOAT_MARGIN,
        },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------ וידאו צף ------------------------ */
  useEffect(() => {
    const onScroll = () => {
      const scroll = window.scrollY;
      const pageScrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      // הפיכה למצב צף - רק אם הדף ארוך מספיק לגלול ממנו חזרה לאפס
      if (!isFloating && scroll > 350 && pageScrollable >= 400)
        setIsFloating(true);
      // חזרה למצב קבוע - תמיד אפשרית, גם בדפים קצרים
      if (isFloating && scroll <= 0) setIsFloating(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFloating]);

  /* ------------------------ גרירת החלון הצף ------------------------ */
  const clampPos = (left, top) => {
    if (typeof window === "undefined") return { left, top };
    const maxLeft = window.innerWidth - floatSize.width - 4;
    const maxTop = window.innerHeight - floatSize.height - 4;
    return {
      left: Math.min(Math.max(left, 4), Math.max(maxLeft, 4)),
      top: Math.min(Math.max(top, 4), Math.max(maxTop, 4)),
    };
  };

  const handleDragStart = (clientX, clientY) => {
    if (!floatPos) return;
    dragInfoRef.current = {
      startX: clientX,
      startY: clientY,
      originLeft: floatPos.left,
      originTop: floatPos.top,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleDragMove = (clientX, clientY) => {
    const info = dragInfoRef.current;
    if (!info) return;
    const dx = clientX - info.startX;
    const dy = clientY - info.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) info.moved = true;
    setFloatPos(clampPos(info.originLeft + dx, info.originTop + dy));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const info = dragInfoRef.current;
    dragInfoRef.current = null;
    if (info?.moved) {
      // הייתה גרירה אמיתית - נסמן כדי שה-click שיגיע אחרי mouseup יתבטל
      justDraggedRef.current = true;
    }
  };

  const onMouseDownVideo = (e) => {
    if (!isFloating || floatSize.anchor === "bottom") return;
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const onTouchStartVideo = (e) => {
    if (!isFloating || floatSize.anchor === "bottom") return;
    const t = e.touches[0];
    handleDragStart(t.clientX, t.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => handleDragEnd();
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) handleDragMove(t.clientX, t.clientY);
    };
    const onTouchEnd = () => handleDragEnd();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging]);

  /* קליק על אזור הגרירה (הפס העליון) - אם לא הייתה גרירה ממשית, לא עושים כלום מיוחד */
  const handleHandleClick = () => {
    justDraggedRef.current = false;
  };

  /* ------------------------ YouTube embed ------------------------ */
  function extractYoutubeId(url) {
    try {
      if (url.includes("youtu.be")) {
        return url.split("youtu.be/")[1].split("?")[0];
      }
      return new URL(url).searchParams.get("v") || "";
    } catch {
      return "";
    }
  }

  function buildEmbedUrl(id) {
    if (!id) return "";
    const params = new URLSearchParams({
      rel: "0",
      playsinline: "1", // לא לפתוח נגן מסך-מלא של המכשיר ב-iOS
      autoplay: "1", // טוענים את ה-iframe רק לאחר לחיצה על כפתור ה-play שלנו, אז מתחילים ישר בנגינה
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  const videoNode = item?.youtube?.nodes?.find((n) => n.type === "VIDEO");
  const videoUrl = videoNode?.videoData?.video?.src?.url ?? "";
  const videoId = extractYoutubeId(videoUrl);
  const embedUrl = buildEmbedUrl(videoId);
  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "";

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
          style={
            isFloating
              ? floatSize.anchor === "bottom"
                ? {
                    ...styles.floatingVideoWrapper,
                    width: floatSize.width,
                    height: floatSize.height,
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: 12,
                    top: "auto",
                    right: "auto",
                  }
                : {
                    ...styles.floatingVideoWrapper,
                    width: floatSize.width,
                    height: floatSize.height,
                    left: floatPos?.left ?? "auto",
                    top: floatPos?.top ?? "auto",
                    right: floatPos ? "auto" : 20,
                    bottom: floatPos ? "auto" : 20,
                    cursor: isDragging ? "grabbing" : "grab",
                  }
              : styles.videoWrapper
          }
        >
          {/* פס גרירה קטן בראש החלון - רק כשמעוגן לפינה (דסקטופ/חלון ביניים); במובייל (anchor=bottom) החלון מוצמד לתחתית בלי גרירה */}
          {isFloating && floatSize.anchor !== "bottom" && (
            <div
              style={{
                ...styles.dragHandle,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={onMouseDownVideo}
              onTouchStart={onTouchStartVideo}
              onClick={(e) => {
                e.stopPropagation();
                handleHandleClick();
              }}
            >
              <span style={styles.dragHandleGrip}>⠿</span>
            </div>
          )}
          {playing ? (
            <iframe
              style={styles.video}
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              // sandbox חוסם באופן מוחלט (ע"י הדפדפן) גם ניווט של כל העמוד וגם
              // פתיחת חלון/טאב חדש מתוך ה-iframe (זה מה שקרה במסך ה"השהיה" -
              // הקישורים ל"סרטונים מומלצים"/"צפה ביוטיוב" ניסו לפתוח טאב חדש).
              // play/pause/seek רגילים לא צריכים את ההרשאות האלה כלל.
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          ) : (
            /* תמונת תצוגה וכפתור play משלנו, במקום הנגן המקורי של יוטיוב -
               כך שהמשתמש לעולם לא לוחץ בפועל על כפתור ה-play המקורי, וזה
               מבטל את הניווט/פתיחת האפליקציה שקרתה בלחיצה עליו במובייל */
            <button
              type="button"
              onClick={() => setPlaying(true)}
              style={styles.posterButton}
              aria-label="הפעל את הסרטון"
            >
              {thumbnailUrl && (
                <img src={thumbnailUrl} alt="" style={styles.posterImage} />
              )}
              <span style={styles.playIconCircle}>
                <span style={styles.playIconTriangle} />
              </span>
            </button>
          )}
        </div>
      )}

      {/* כפתורי מצבים */}
      <div style={styles.modeButtons}>
        {["he", "ar", "both", "sources"]
          .filter((mode) => mode !== "sources" || type == "iyun")
          .map((mode) => (
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
    zIndex: 9999,
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
    userSelect: "none",
  },

  dragHandle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 26,
    zIndex: 2,
    background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  dragHandleGrip: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    lineHeight: 1,
    letterSpacing: 2,
    pointerEvents: "none",
  },

  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  posterButton: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
    border: "none",
    background: "#000",
    cursor: "pointer",
  },

  posterImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  playIconCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  playIconTriangle: {
    width: 0,
    height: 0,
    borderTop: "12px solid transparent",
    borderBottom: "12px solid transparent",
    borderLeft: "18px solid white",
    marginRight: -4,
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
