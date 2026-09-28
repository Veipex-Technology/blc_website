import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/routing";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/")
    return NextResponse.redirect(new URL("/ar", request.url));

  const firstSegment = pathname.split("/")[1];
  if (!isLocale(firstSegment)) {
    return NextResponse.redirect(new URL(`/ar${pathname}`, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-blc-locale", firstSegment);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
