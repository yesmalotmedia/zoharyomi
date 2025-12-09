/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";

export default function LessonCard({ type, item }) {
  const thumb = extractThumbnail(item);

  return (
    <Link
      href={`/shiur/${type}/${item._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div style={styles.card}>
        {/* תמונה */}
        <div style={styles.thumbnailWrapper}>
          <Image
            src={thumb}
            alt={`תמונה לשיעור פרשת ${item.parasha}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="300px"
          />

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

  thumbnailWrapper: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // יחס 16:9
    overflow: "hidden",
    background: "#000",
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
