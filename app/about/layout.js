// הדף עצמו הוא client component, לכן ה-metadata מוגדר כאן
export const metadata = {
  title: "אודות",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }) {
  return children;
}
