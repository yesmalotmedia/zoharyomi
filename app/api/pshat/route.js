import { fetchCollection } from "@/utils/wixFetch";

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await fetchCollection("pshat");

    const items = Array.isArray(data?.items) ? data.items : [];

    // מיון לפי pageid (חדש → ישן)
    items.sort((a, b) => {
      const pa = Number(a.pageid ?? 0);
      const pb = Number(b.pageid ?? 0);
      return pb - pa; // חדש ראשון
    });

    return Response.json({ items });
  } catch (err) {
    console.error("❌ ERROR in /api/pshat:", err.message);

    return Response.json({ items: [] });
  }
}
