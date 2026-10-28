// utils/seo.js
import { cache } from "react";
import { fetchItem } from "@/utils/wixFetch";
import { extractThumbnail } from "@/utils/extractYoutube";

export const SITE_URL = "https://www.zohar-yomi.org";
export const SITE_NAME = "הזוהר היומי";

export const LESSON_TYPES = {
  pshat: { collection: "pshat", label: "פשט" },
  iyun: { collection: "Import1", label: "עיון" },
};

//
// --- שיעור בודד ---
//     generateMetadata והדף עצמו קוראים לאותו שיעור - cache מונע קריאה כפולה ל-Wix
//
export const getLesson = cache(async (type, lessonId) => {
  const data = (await fetchItem(LESSON_TYPES[type].collection, lessonId)) ?? {};
  return data.item ?? null;
});

// הסרת ניקוד - אנשים מחפשים בגוגל בלי ניקוד
const stripNiqqud = (text) => String(text ?? "").replace(/[֑-ׇ]/g, "");

const pageLabel = (page) => {
  if (page === "א") return 'ע"א';
  if (page === "ב") return 'ע"ב';
  return page ?? "";
};

export function lessonTitle(type, item) {
  const parts = [`פרשת ${item.parasha?.trim()}`, `דף ${item.daf} ${pageLabel(item.page)}`];
  if (item.par) parts.push(`פסקה ${item.par}`);
  return `${parts.join(" ")} – זוהר ${LESSON_TYPES[type].label}`;
}

function lessonDescription(type, item) {
  const excerpt = stripNiqqud(item.hebrew || item.aramit)
    .replace(/\s+/g, " ")
    .trim();
  const intro = `שיעור ${LESSON_TYPES[type].label} בזוהר היומי על פרשת ${item.parasha?.trim()} דף ${item.daf}`;
  if (!excerpt) return `${intro}.`;
  return `${intro}: ${excerpt.slice(0, 140)}${excerpt.length > 140 ? "…" : ""}`;
}

function youtubeId(item) {
  const thumb = extractThumbnail(item);
  return thumb.includes("/vi/") ? thumb.split("/vi/")[1].split("/")[0] : null;
}

//
// --- metadata לדף שיעור ---
//
export function lessonMetadata(type, item) {
  if (!item) {
    return { title: "שיעור לא נמצא", robots: { index: false } };
  }

  const title = lessonTitle(type, item);
  const description = lessonDescription(type, item);
  const url = `/shiur/${type}/${item.pageid}`;
  const thumb = extractThumbnail(item);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "video.other",
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "he_IL",
      images: thumb.startsWith("http") ? [thumb] : undefined,
    },
  };
}

//
// --- נתונים מובנים (JSON-LD) - מאפשר לגוגל להציג את השיעור כתוצאת וידאו ---
//
export function lessonJsonLd(type, item) {
  const id = youtubeId(item);
  if (!id) return null;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: lessonTitle(type, item),
    description: lessonDescription(type, item),
    thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    uploadDate: item._createdDate,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    inLanguage: "he",
    url: `${SITE_URL}/shiur/${type}/${item.pageid}`,
  };
}
