"use client";

import { useEffect, useState } from "react";
import LessonCard from "@/components/LessonCard";
import SearchFilters from "@/components/SearchFilters";

export default function IyunPage() {
  const [allLessons, setAllLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [visibleLessons, setVisibleLessons] = useState([]);
  const [count, setCount] = useState(10);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // --- טעינת כל השיעורים ---
  // --- טעינת כל השיעורים ---
  useEffect(() => {
    async function load() {
      try {
        setLoadingInitial(true);
        const res = await fetch("/api/pshat");
        const data = await res.json();

        // ממיינים לפי position (מספר)
        const sorted = [...data.items].sort((b, a) => {
          return (a.pageid ?? 0) - (b.pageid ?? 0);
        });

        setAllLessons(sorted);
        setFilteredLessons(sorted);
        setVisibleLessons(sorted.slice(0, 10));
      } finally {
        setLoadingInitial(false);
      }
    }

    load();
  }, []);

  // --- כאשר הסינון משתנה ---
  function handleFilterResults(results) {
    setFilteredLessons(results);
    setCount(10);
    setVisibleLessons(results.slice(0, 10));
  }

  // --- טעינת עוד ---
  async function loadMore() {
    setLoadingMore(true);

    setTimeout(() => {
      const newCount = count + 10;
      setCount(newCount);
      setVisibleLessons(filteredLessons.slice(0, newCount));
      setLoadingMore(false);
    }, 400); // כדי לקבל אנימציה חלקה
  }

  return (
    <div style={{ padding: 20, direction: "rtl" }}>
      <h1 style={{ textAlign: "right" }}>שיעורי פשט</h1>

      {/* --- Spinner טעינה ראשונית --- */}
      {loadingInitial && (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {!loadingInitial && (
        <>
          <SearchFilters lessons={allLessons} onResults={handleFilterResults} />

          <div style={styles.grid}>
            {visibleLessons.map((item) => (
              <div key={item._id} style={styles.cardWrapper}>
                <LessonCard item={item} type={"pshat"} />
              </div>
            ))}
          </div>

          {/* כפתור טען עוד */}
          {visibleLessons.length < filteredLessons.length && (
            <button
              style={styles.loadMore}
              onClick={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <div style={styles.smallSpinner}></div>
              ) : (
                "טען עוד"
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: 25,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  loadMore: {
    margin: "30px auto",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "10px",
    background: "#0a3a75",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "block",
  },

  /* --- Spinner מרכזי בזמן טעינה ראשונית --- */
  spinnerWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: 80,
  },
  spinner: {
    width: 50,
    height: 50,
    border: "5px solid #ddd",
    borderTopColor: "#0a3a75",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* --- Spinner קטן ל־"טען עוד" --- */
  smallSpinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #fff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.8s linear infinite",
  },
};

/* אנימציית ספין */
if (typeof document !== "undefined") {
  const css = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}
