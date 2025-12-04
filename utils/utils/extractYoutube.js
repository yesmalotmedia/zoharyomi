export function extractYoutubeUrl(item) {
  // הגנה בסיסית
  if (!item?.youtube?.nodes?.length) return null;

  // מוצא את הצומת הראשון מסוג VIDEO
  const videoNode = item.youtube.nodes.find((node) => node.type === "VIDEO");

  if (!videoNode) return null;

  // מחלץ את ה־URL
  return videoNode.videoData?.video?.src?.url || null;
}
