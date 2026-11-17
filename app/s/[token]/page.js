import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { getLesson, lessonTitle } from "@/utils/seo";
import { getSharedSheet } from "@/data/sourceSheets";

// שיעור עם דף המקורות שלו, בקישור סודי בלבד (data/sourceSheets).
// כשדפי המקורות יאושרו, הם יעברו לדף השיעור הרגיל.

export async function generateMetadata(props) {
  const { token } = await props.params;
  const shared = getSharedSheet(token);
  const item = shared && (await getLesson(shared.type, shared.lessonId));
  return {
    title: item ? `מקורות: ${lessonTitle(shared.type, item)}` : "דף מקורות",
    robots: { index: false, follow: false },
  };
}

export default async function SharedSheetPage(props) {
  const { token } = await props.params;
  const shared = getSharedSheet(token);
  const item = shared && (await getLesson(shared.type, shared.lessonId));
  if (!item) notFound();

  return <LessonView key={item.pageid} item={item} type={shared.type} sheet={shared.sheet} study={shared.study} />;
}
