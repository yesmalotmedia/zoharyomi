// utils/wixFetch.js

// קבלת פריטים עם WHERE
export async function fetchFromWix(collectionName, where = {}) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ where }),
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

// קבלת כל הקולקשן (GET)
export async function fetchCollection(collectionName) {
  const endpoint = `${process.env.NEXT_PUBLIC_WIX_ENDPOINT}/getCollection?collection=${collectionName}`;

  const res = await fetch(endpoint, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Wix fetch failed (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

// פריט בודד ע"י wixData.get
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

  return res.json();
}
