import { fetchCollection } from "@/utils/wixFetch";

export async function GET() {
  const data = await fetchCollection("Import1");

  return Response.json(data ?? { items: [], error: "Empty response from Wix" });
}
