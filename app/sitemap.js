import { fetchCollection } from "@/utils/wixFetch";
import { SITE_URL, LESSON_TYPES } from "@/utils/seo";

// מפת האתר מתעדכנת יחד עם הקאש של Wix (דקה) - שיעורים חדשים נכנסים אליה אוטומטית
export const revalidate = 60;

export default async function sitemap() {
  const pages = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shiur/pshat`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shiur/iyun`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const [type, { collection }] of Object.entries(LESSON_TYPES)) {
    try {
      const data = await fetchCollection(collection);
      const items = Array.isArray(data?.items) ? data.items : [];

      for (const item of items) {
        if (!item.pageid) continue;
        pages.push({
          url: `${SITE_URL}/shiur/${type}/${item.pageid}`,
          lastModified: item._updatedDate,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    } catch (err) {
      console.error(`❌ ERROR in sitemap (${type}):`, err.message);
    }
  }

  return pages;
}
