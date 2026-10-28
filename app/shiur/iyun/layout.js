// הדף עצמו הוא client component, לכן ה-metadata של הרשימה מוגדר כאן
export const metadata = {
  // template מוגדר שוב כאן - אחרת דפי השיעור לא מקבלים את שם האתר בסוף הכותרת
  title: { default: "שיעורי עיון בזוהר", template: "%s | הזוהר היומי" },
  description:
    "כל שיעורי העיון בזוהר היומי - לימוד מעמיק בזוהר הקדוש, עם המקור בארמית ותרגום לעברית, לפי פרשה ודף.",
  alternates: { canonical: "/shiur/iyun" },
};

export default function IyunLayout({ children }) {
  return children;
}
