import LessonView from "@/components/LessonView";
import { fetchItem } from "@/utils/wixFetch";
import RememberLastLesson from "@/components/RememberLastLesson";

export default async function LessonPage(props) {
  const { lessonId } = await props.params;

  const data = (await fetchItem("Import1", lessonId)) ?? {};
  const item = data.item;

  if (!item) {
    return <div style={{ padding: 40 }}>שיעור לא נמצא</div>;
  }

  return (
    <>
      <RememberLastLesson item={item} type={"iyun"} />
      <LessonView item={item} type="iyun" />
    </>
  );
}
