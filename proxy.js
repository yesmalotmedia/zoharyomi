// דפי /preview פתוחים רק למי שהזין את סיסמת התצוגה המקדימה (ראו utils/previewAuth.js)
import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, previewToken } from "./utils/previewAuth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/preview/login")) return NextResponse.next();

  const password = process.env.PREVIEW_PASSWORD;
  const cookie = request.cookies.get(PREVIEW_COOKIE)?.value;
  if (password && cookie === (await previewToken(password))) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const login = request.nextUrl.clone();
  login.pathname = "/preview/login";
  login.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/preview/:path*"],
};
