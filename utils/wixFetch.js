// // utils/wixFetch.js

// //
// // --- Parser משופר שמאפשר גם partial JSON וגם JSON מלא ---
// //
// async function safeJson(res) {
//   const text = await res.text();

//   // Wix לעיתים מחזיר "" ריק במקום {} → צריך לנטרל
//   if (!text || text.trim() === "") {
//     console.warn("Wix returned empty response body");
//     return null;
//   }

//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     console.error("Failed to parse JSON from Wix:", text);
//     throw new Error("Invalid JSON returned from Wix backend");
//   }
// }

// //
// // --- Helper לפורמט בקשה ---
// //
// function buildBody({ where = {}, fields, limit }) {
//   const payload = { where };

//   if (fields) payload.fields = fields;
//   if (limit) payload.limit = limit;

//   return JSON.stringify(payload);
// }

// //
// // --- POST (עם פילטרים) ---
// //
// export async function fetchFromWix(collectionName, options = {}) {
//   const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection`;

//   const res = await fetch(endpoint, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     // ❗ חשוב: לא עושים cache כאן כי page.js יקבל cache מהשרת
//     cache: "force-cache",
//     body: buildBody(options),
//   });

//   if (!res.ok) {
//     throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
//   }

//   return safeJson(res);
// }

// //
// // --- GET של קולקשן שלם ---
// //     מאפשר: fields (projection) + limit
// //
// export async function fetchCollection(collectionName, options = {}) {
//   const params = new URLSearchParams({ collection: collectionName });

//   if (options.fields) params.set("fields", JSON.stringify(options.fields));
//   if (options.limit) params.set("limit", 1000);

//   const endpoint = `${
//     process.env.NEXT_PUBLIC_WIX_ENDPOINT
//   }/getCollection?${params.toString()}`;

//   const res = await fetch(endpoint, {
//     method: "GET",
//     next: { revalidate: 3600 }, // שעה קאש
//   });

//   if (!res.ok) {
//     throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
//   }

//   return safeJson(res);
// }

// //
// // --- פריט בודד ---
// //
// export async function fetchItem(collection, id) {
//   const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getItem`;

//   const res = await fetch(endpoint, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     next: { revalidate: 3600 }, // ✔ קאש חכם של Next
//     body: JSON.stringify({ collection, id }),
//   });

//   if (!res.ok) {
//     let payload = null;
//     try {
//       payload = await res.json();
//     } catch (_) {}

//     if (res.status === 400 && payload?.error === "Item not found") {
//       return null;
//     }

//     throw new Error(
//       `Wix fetch failed (${res.status}): ${JSON.stringify(payload)}`,
//     );
//   }

//   return res.json();
// }
// // ניווט לשיעור קודם / הבא (פשט)
// export async function fetchPshatNav(pageid) {
//   const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getPshatNav`;

//   const res = await fetch(endpoint, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     cache: "no-cache",
//     body: JSON.stringify({ pageid }),
//   });

//   if (!res.ok) {
//     return null;
//   }

//   return res.json();
// }

// utils/wixFetch.js

//
// --- JSON parser בטוח ---
//
async function safeJson(res) {
  const text = await res.text();

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
// --- Builder לגוף POST ---
//
function buildBody({ where = {}, fields, limit }) {
  const payload = { where };

  if (fields) payload.fields = fields;
  if (limit) payload.limit = limit;

  return JSON.stringify(payload);
}

//
// --- POST עם פילטרים (רשימות / חיפושים) ---
//
export async function fetchFromWix(collectionName, options = {}) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }, // ✅ קאש שרת אחיד
    body: buildBody(options),
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return safeJson(res);
}

//
// --- GET של קולקשן (לרשימות) ---
//     תומך ב: fields + limit
//
export async function fetchCollection(collectionName, options = {}) {
  const params = new URLSearchParams({ collection: collectionName });

  if (options.fields) {
    params.set("fields", JSON.stringify(options.fields));
  }

  if (options.limit) {
    params.set("limit", String(options.limit)); // ✅ מכבד limit אמיתי
  }

  const endpoint = `${
    process.env.NEXT_PUBLIC_WIX_ENDPOINT
  }/getCollection?${params.toString()}`;

  const res = await fetch(endpoint, {
    method: "GET",
    next: { revalidate: 3600 }, // ✅ לא no-store
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return safeJson(res);
}

//
// --- פריט בודד (עמוד שיעור) ---
//
export async function fetchItem(collection, id) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getItem`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }, // ✅ קאש לפריט
    body: JSON.stringify({ collection, id }),
  });

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch (_) {}

    if (res.status === 400 && payload?.error === "Item not found") {
      return null;
    }

    throw new Error(
      `Wix fetch failed (${res.status}): ${JSON.stringify(payload)}`,
    );
  }

  return res.json();
}

//
// --- ניווט קודם / הבא (בלי קאש) ---
//
export async function fetchPshatNav(pageid) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getPshatNav`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-cache", // ✅ תמיד טרי
    body: JSON.stringify({ pageid }),
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}
// ניווט לשיעור קודם / הבא (פשט)
