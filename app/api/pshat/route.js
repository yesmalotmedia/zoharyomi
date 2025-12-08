import { fetchCollection } from "@/utils/wixFetch";

export async function GET() {
  const data = await fetchCollection("pshat");

  // מונע קריסה גם אם Wix מחזיר JSON ריק
  return Response.json(data ?? { items: [], error: "Empty response from Wix" });
}
