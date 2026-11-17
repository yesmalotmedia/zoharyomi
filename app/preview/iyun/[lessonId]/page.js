import { notFound } from "next/navigation";
import LessonView from "@/components/LessonView";
import { getLesson, lessonTitle } from "@/utils/seo";
import { getSourceSheet } from "@/data/sourceSheets";

// תצוגה מקדימה של שיעור עם דף המקורות שלו (מוגן בסיסמה - proxy.js).
// כשדפי המקורות יאושרו, הם יעברו לדף השיעור הרגיל.

export async function generateMetadata(props) {
  const { lessonId } = await props.params;
  const item = await getLesson("iyun", lessonId);
  return {
    title: item ? `מקורות: ${lessonTitle("iyun", item)}` : "דף מקורות",
    robots: { index: false, follow: false },
  };
}

export default async function PreviewLessonPage(props) {
  const { lessonId } = await props.params;
  const sheet = getSourceSheet("iyun", lessonId);
  const item = sheet && (await getLesson("iyun", lessonId));
  if (!item) notFound();

  return <LessonView key={item.pageid} item={item} type="iyun" sheet={sheet} />;
}
