import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];
const ADMIN_PATHS = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refreshToken");

  // Let public assets and API routes through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // No cookie → send to login (except public paths)
  if (!hasRefreshToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Has cookie but trying to access login/register → send to dashboard
  if (hasRefreshToken && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin paths — role check happens server-side, middleware just passes through
  // (role is in the access token in memory, not in the cookie — can't read it at edge)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
