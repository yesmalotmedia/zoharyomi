// utils/wixFetch.js

//
// פונקציה בטוחה לפענוח JSON – מונעת את השגיאה:
// Unexpected end of JSON input
//
async function safeJson(res) {
  const text = await res.text();

  // אם Wix מחזיר גוף ריק, לא נקרוס
  if (!text || text.trim() === "") {
    console.warn("Wix returned empty response body");
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Wix:", text);
    throw new Error("Invalid JSON returned from Wix backend");
  }
}

//
// קבלת פריטים עם WHERE
//
export async function fetchFromWix(collectionName, where = {}) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ where }),
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return safeJson(res);
}

//
// קבלת כל הקולקשן (GET)
//
export async function fetchCollection(collectionName) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection?collection=${collectionName}`;

  const res = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return safeJson(res);
}

//
// פריט בודד מתוך Wix (getItem)
//
export async function fetchItem(collection, id) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getItem`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ collection, id }),
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return safeJson(res);
}
