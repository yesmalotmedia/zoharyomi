/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import LessonCard from "@/components/LessonCard";

export default function SearchBox({ lessons }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const q = query.trim();

    if (q === "") {
      setResults([]);
      return;
    }

    // חיפוש פשוט בכל השדות הרלוונטיים
    const filtered = lessons.filter((item) => {
      const text = `${item.parasha || ""} ${item.daf || ""} ${
        item.page || ""
      } ${item.hebrew || ""} ${item.aramit || ""}`.toLowerCase();

      return text.includes(q.toLowerCase());
    });

    setResults(filtered);
  }, [query, lessons]);

  return (
    <div style={{ marginTop: 20, direction: "rtl" }}>
      {/* שדה החיפוש */}
      <input
        type="text"
        placeholder="חפש שיעור לפי פרשה, דף, עמוד, או מילת מפתח…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: 12,
          border: "1px solid #ccc",
          fontSize: 18,
          marginBottom: 20,
        }}
      />

      {/* תוצאות */}
      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {results.length > 0 &&
          results.map((item) => (
            <LessonCard key={item._id} item={item} type="pshat" />
          ))}
      </div>

      {/* הודעה כשאין תוצאות */}
      {query.length > 1 && results.length === 0 && (
        <div style={{ padding: 10, color: "#888" }}>
          לא נמצאו תוצאות לחיפוש &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
