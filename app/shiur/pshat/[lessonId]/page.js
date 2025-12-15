import LessonView from "@/components/LessonView";
import { fetchItem } from "@/utils/wixFetch";

export default async function LessonPage(props) {
  const { lessonId } = await props.params;

  const data = (await fetchItem("pshat", lessonId)) ?? {};
  const item = data.item;

  if (!item) {
    return <div style={{ padding: 40 }}>שיעור לא נמצא</div>;
  }

  return <LessonView item={item} type="pshat" />;
}
