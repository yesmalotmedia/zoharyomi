"use client";

import { useEffect, useState } from "react";
import LessonCard from "@/components/LessonCard";
import SearchFilters from "@/components/SearchFilters";

export default function PshatPage() {
  const [allLessons, setAllLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [visibleLessons, setVisibleLessons] = useState([]);
  const [count, setCount] = useState(10);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadInitialFast();
  }, []);

  async function loadInitialFast() {
    try {
      setLoadingInitial(true);

      const res = await fetch("/api/pshat");
      const fullJson = await res.json(); // קריאה אחת ויחידה
      const items = fullJson.items ?? [];

      // מציג מייד את 10 הראשונים
      setVisibleLessons(items.slice(0, 10));

      // בשלב שני שומר את הכל
      setAllLessons(items);
      setFilteredLessons(items);
    } finally {
      setLoadingInitial(false);
    }
  }

  function handleFilterResults(results) {
    setFilteredLessons(results);
    setCount(10);
    setVisibleLessons(results.slice(0, 10));
  }

  function loadMore() {
    setLoadingMore(true);

    setTimeout(() => {
      const newCount = count + 10;
      setCount(newCount);
      setVisibleLessons(filteredLessons.slice(0, newCount));
      setLoadingMore(false);
    }, 300);
  }

  return (
    <div style={{ padding: 20, direction: "rtl" }}>
      <h1 style={{ textAlign: "right", color: "#0a3a75" }}>שיעורי פשט</h1>

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
                <LessonCard item={item} type="pshat" />
              </div>
            ))}
          </div>

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

/* -----------------------------  styles  ----------------------------- */

const styles = {
  grid: {
    display: "flex",
    gap: "20px",
    marginTop: 25,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  cardWrapper: {
    width: "300px",
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

/* הזרקת אנימציית spin */
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
