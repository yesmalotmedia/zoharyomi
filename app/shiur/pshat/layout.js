// הדף עצמו הוא client component, לכן ה-metadata של הרשימה מוגדר כאן
export const metadata = {
  // template מוגדר שוב כאן - אחרת דפי השיעור לא מקבלים את שם האתר בסוף הכותרת
  title: { default: "שיעורי פשט בזוהר", template: "%s | הזוהר היומי" },
  description:
    "כל שיעורי הפשט בזוהר היומי - שיעורים קצרים על הזוהר הקדוש, עם המקור בארמית ותרגום לעברית, לפי פרשה ודף.",
  alternates: { canonical: "/shiur/pshat" },
};

export default function PshatLayout({ children }) {
  return children;
}
