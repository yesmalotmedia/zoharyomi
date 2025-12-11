import { fetchCollection } from "@/utils/wixFetch";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await fetchCollection("Import1"); // שם הקולקשן האמיתי

    const items = Array.isArray(data?.items) ? data.items : [];

    // מיון לפי pageid
    items.sort((a, b) => {
      const pa = Number(a.pageid ?? 0);
      const pb = Number(b.pageid ?? 0);
      return pa - pb;
    });

    return Response.json({ items });
  } catch (err) {
    console.error("❌ ERROR in /api/iyun:", err.message);

    // מחזיר JSON תקין גם כשויקס נופל
    return Response.json({ items: [] });
  }
}
