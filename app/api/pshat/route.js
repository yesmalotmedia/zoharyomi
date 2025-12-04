import { fetchFromWix } from "@/utils/wixFetch";
import { COLLECTIONS } from "@/config/collections";

export async function GET() {
  const data = await fetchFromWix(COLLECTIONS.pshat);
  return Response.json(data.items || data);
}
