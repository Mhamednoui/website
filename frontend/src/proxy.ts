import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refreshToken");

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!hasRefreshToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasRefreshToken && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
