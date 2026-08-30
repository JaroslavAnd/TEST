import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Proxy замість middleware (Next.js 16)
// Захист routes: redirect неавторизованих на /login
export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile",
    "/profile/security",
    "/articles/create",
    "/articles/:id/edit",
  ],
};
