import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { getLesson, lessonTitle } from "@/utils/seo";
import { getSharedSheet } from "@/data/sourceSheets";

// שיעור עם דף המקורות שלו, בקישור סודי בלבד (data/sourceSheets).
// כשדפי המקורות יאושרו, הם יעברו לדף השיעור הרגיל.

export async function generateMetadata(props) {
  const { token } = await props.params;
  const { lang } = await props.searchParams;
  const shared = getSharedSheet(token);
  const item = shared && (await getLesson(shared.type, shared.lessonId));
  const english = lang === "en" && shared?.english;
  return {
    title: english ? `${english.title} | Zohar Yomi` : item ? `מקורות: ${lessonTitle(shared.type, item)}` : "דף מקורות",
    robots: { index: false, follow: false },
  };
}

export default async function SharedSheetPage(props) {
  const { token } = await props.params;
  const { lang } = await props.searchParams; // lang=en פותח ישר באנגלית
  const shared = getSharedSheet(token);
  const item = shared && (await getLesson(shared.type, shared.lessonId));
  if (!item) notFound();

  return (
    <LessonView
      key={item.pageid}
      item={item}
      type={shared.type}
      sheet={shared.sheet}
      study={shared.study}
      english={shared.english}
      startMode={lang === "en" && shared.english ? "en" : undefined}
    />
  );
}
