// כתובות מהאתר הישן ב-Wix שגוגל וקישורים ישנים עדיין מפנים אליהן
const OLD_WIX_PAGES = {
  "/על-הפרוקייקט": "/about",
  "/eyun-collection": "/shiur/iyun",
  "/לוח-לימוד": "/",
  "/העמוד-היומי": "/",
  "/חפש-עמוד": "/",
  "/copy-of-דף-הבית": "/",
  "/צור-קשר": "/",
  "/forum": "/",
  "/members": "/",
  "/blank": "/",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // reactCompiler: true,

  async redirects() {
    return [
      // דפי שיעור ישנים (/pages/796) - לא תואמים אחד-לאחד לשיעורים החדשים, לכן לרשימה
      { source: "/pages/:path*", destination: "/shiur/iyun", permanent: true },
      // הדפדפן שולח כתובות בעברית מקודדות - encodeURI כדי שההתאמה תעבוד
      ...Object.entries(OLD_WIX_PAGES).map(([source, destination]) => ({
        source: encodeURI(source),
        destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
