function extractThumbnail(item) {
  try {
    if (!item?.youtube?.nodes) return "/placeholder.jpg";

    const node = item.youtube.nodes.find((n) => n.type === "VIDEO");
    if (!node) return "/placeholder.jpg";

    // 1) קודם ננסה URL ישיר
    let url =
      node?.videoData?.video?.src?.url || node?.videoData?.src || node?.src;

    if (!url) return "/placeholder.jpg";

    let id = "";

    // 2) תמיכה ב- youtu.be
    if (url.includes("youtu.be")) {
      id = url.split("youtu.be/")[1].split("?")[0];
    }

    // 3) תמיכה ב- youtube.com/watch?v=
    else if (url.includes("v=")) {
      id = new URL(url).searchParams.get("v");
    }

    // 4) תמיכה ב- embed/ID
    else if (url.includes("embed/")) {
      id = url.split("embed/")[1].split("?")[0];
    }

    if (!id) return "/placeholder.jpg";

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    return "/placeholder.jpg";
  }
}
