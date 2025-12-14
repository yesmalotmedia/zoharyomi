"use client";

import Link from "next/link";

export default function LessonCard({ type, item }) {
  const thumb = extractThumbnail(item);
  return (
    <Link
      href={
        type == "iyun"
          ? `/shiur/${type}/${item._id}`
          : `/shiur/${type}/${item.pageid}`
      }
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={styles.card}>
        {/* תמונת תצוגה מקדימה */}
        <div style={styles.thumbnailWrapper}>
          <img src={thumb} style={styles.thumbnail} />

          {/* אייקון Play */}
          <div style={styles.playIconWrapper}>
            <div style={styles.playIcon} />
          </div>
        </div>

        {/* טקסט */}
        <div style={styles.textWrapper}>
          <div style={styles.title}>פרשת {item.parasha}</div>

          <div style={styles.details}>
            דף {item.daf} עמוד {item.page}
            {item.par && <> • פסקה {item.par}</>}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* מחלץ thumbnail מיוטיוב */
function extractThumbnail(item) {
  try {
    const videoNode = item?.youtube?.nodes?.find((n) => n.type === "VIDEO");

    const url = videoNode?.videoData?.video?.src?.url;
    if (!url) return "/placeholder.jpg";

    let id = "";
    if (url.includes("youtu.be")) {
      id = url.split("youtu.be/")[1].split("?")[0];
    } else {
      id = new URL(url).searchParams.get("v");
    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    return "/placeholder.jpg";
  }
}

/* ===== עיצוב ===== */
const styles = {
  card: {
    background: "white",
    borderRadius: 12,
    width: 300,
    boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },

  /* הובר כמו יוטיוב */
  cardHover: {
    transform: "scale(1.02)",
    boxShadow: "0 6px 22px rgba(0,0,0,0.18)",
  },

  thumbnailWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // 16:9
    overflow: "hidden",
    background: "#000",
  },

  thumbnail: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    top: 0,
    left: 0,
  },

  playIconWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 60,
    height: 60,
    background: "rgba(0,0,0,0.45)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    width: 0,
    height: 0,
    borderTop: "12px solid transparent",
    borderBottom: "12px solid transparent",
    borderLeft: "18px solid white",
    marginLeft: 4,
  },

  textWrapper: {
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: 600,
    color: "#0a3a75",
    marginBottom: 6,
  },

  details: {
    fontSize: 14,
    color: "#555",
  },
};
