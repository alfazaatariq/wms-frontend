import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value; // Get JWT from cookies

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login if no token
  }

  return NextResponse.next(); // Allow access if token exists
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all dashboard routes
};
