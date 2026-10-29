import { SITE_NAME } from "@/utils/seo";

// מאפשר "הוספה למסך הבית" - האתר נפתח כמו אפליקציה, במסך מלא ועם אייקון משלו
export default function manifest() {
  return {
    name: "הלימוד היומי בזוהר",
    short_name: SITE_NAME,
    description: "שיעורי פשט ועיון בזוהר הקדוש - לימוד יומי",
    start_url: "/",
    scope: "/",
    display: "standalone",
    dir: "rtl",
    lang: "he",
    background_color: "#0a3a75",
    theme_color: "#0a3a75",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
