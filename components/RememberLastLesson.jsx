"use client";

import { useEffect } from "react";

export default function RememberLastLesson({ item, type }) {
  useEffect(() => {
    if (!item) return;

    try {
      const currentId = Number(item.pageid || item._id);

      localStorage.setItem(
        "lastLesson",
        JSON.stringify({
          url: window.location.pathname,
          daf: item.daf,
          page: item.page,
          par: item.par,
          currentId,
          nextId: currentId + 1,
          type,
        })
      );
    } catch {}
  }, [item]);

  return null;
}
