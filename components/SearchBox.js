"use client";

import { useState, useEffect } from "react";
import LessonCard from "@/components/LessonCard";

export default function SearchBox({ lessons }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
  }, [query]);

  return (
    <div style={{ marginTop: 20, direction: "rtl" }}>
      {/* שדה החיפוש */}
      <input
        type="text"
        placeholder="חפש שיעור לפי פרשה, דף, מילה בעברית או ארמית…"
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
          results.map((item) => <LessonCard key={item._id} item={item} />)}
      </div>

      {/* הודעה כשאין תוצאות */}
      {query.length > 1 && results.length === 0 && (
        <div style={{ padding: 10, color: "#888" }}>
          לא נמצאו תוצאות לחיפוש "{query}"
        </div>
      )}
    </div>
  );
}
