import LessonView from "@/components/LessonView";
import { getLesson, lessonMetadata, lessonJsonLd } from "@/utils/seo";
import RememberLastLesson from "@/components/RememberLastLesson";
import Link from "next/link";

export async function generateMetadata(props) {
  const { lessonId } = await props.params;
  return lessonMetadata("pshat", await getLesson("pshat", lessonId));
}

export default async function LessonPage(props) {
  const { lessonId } = await props.params;

  const item = await getLesson("pshat", lessonId);

  if (!item) {
    return (
      <div
        style={{
          margin: "auto",
          width: "80%",
          textAlign: "center", // 👈 מרכז במובייל
        }}
      >
        <div style={{ padding: "20px 0" }}>
          שיעור לא קיים , יתכן שהוא עדיין לא עלה לאתר...
        </div>

        <Link
          href="/shiur/pshat"
          style={{
            display: "inline-block", // מאפשר מרכז עם textAlign
            padding: "10px 18px",
            background: "#1b73c0",
            color: "white",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            margin: "0 auto", // 👈 ביטוח נוסף למובייל
          }}
        >
          חזרה לרשימת שיעורי פשט
        </Link>
      </div>
    );
  }

  const jsonLd = lessonJsonLd("pshat", item);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <RememberLastLesson item={item} type={"pshat"} />
      <LessonView item={item} type="pshat" />
    </>
  );
}
