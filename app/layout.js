import "./globals.css";
import { Heebo } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Analytics } from "@vercel/analytics/react"; // 👈 הוספה
import { SITE_URL, SITE_NAME } from "@/utils/seo";

const heebo = Heebo({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
});

// צבע שורת הכתובת / שורת המצב בטלפון, ובאפליקציה המותקנת
export const viewport = {
  themeColor: "#0a3a75",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  appleWebApp: { title: SITE_NAME, statusBarStyle: "default" },
  title: {
    default: "הלימוד היומי בזוהר",
    template: `%s | ${SITE_NAME}`,
  },
  description: "לימוד הזוהר היומי בארץ ובעולם",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "he_IL",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={heebo.variable}
        style={{
          margin: 0,
          padding: 0,
          background: "#f7f7f7",
          fontFamily: "var(--font-heebo)",
        }}
      >
        {/* יוצג בכל דף חוץ מדף הבית */}
        <ConditionalNavbar />

        {/* תוכן הדף */}
        <div>{children}</div>

        {/* 👈 אנליטיקס של Vercel */}
        <Analytics />
      </body>
    </html>
  );
}
