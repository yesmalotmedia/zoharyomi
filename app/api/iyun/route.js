import { fetchCollection } from "@/utils/wixFetch";

// ISR: התגובה מוגשת מהקאש מיידית, ומתרעננת מ-Wix ברקע לכל היותר פעם בדקה
export const revalidate = 60;

export async function GET() {
  try {
    const data = await fetchCollection("Import1"); // קולקשן עיון

    const items = Array.isArray(data?.items) ? data.items : [];

    // מיון לפי pageid — חדש → ישן
    items.sort((a, b) => {
      const pa = Number(a.pageid ?? 0);
      const pb = Number(b.pageid ?? 0);
      return pb - pa;
    });

    // לרשימה שולחים רק את השדות שהכרטיס והסינון צריכים - בלי הטקסט המלא (aramit/hebrew)
    const listItems = items.map(({ _id, pageid, parasha, daf, page, par, youtube }) => ({
      _id,
      pageid,
      parasha,
      daf,
      page,
      par,
      youtube,
    }));

    return Response.json({ items: listItems });
  } catch (err) {
    console.error("❌ ERROR in /api/iyun:", err.message);

    return Response.json({ items: [] });
  }
}
