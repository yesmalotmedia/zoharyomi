import { SITE_URL } from "@/utils/seo";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/luach"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
