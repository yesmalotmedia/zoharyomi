import "./globals.css";
import { Heebo } from "next/font/google";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Analytics } from "@vercel/analytics/react"; // 👈 הוספה

const heebo = Heebo({
  subsets: ["hebrew"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
});

export const metadata = {
  title: "הלימוד היומי בזוהר",
  description: "לימוד הזוהר היומי בארץ ובעולם",
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
