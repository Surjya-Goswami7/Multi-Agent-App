import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "auth"; // Adjust if needed
import type { UserInfo } from "app/utils/common/type"; //

const allowedOrigins: string[] = ["http://localhost:3000"];

const setCORSHeaders = (res: NextResponse, origin: string | null): void => {
  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    res.headers.set("Access-Control-Allow-Origin", "null");
  }

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Data, X-Api-Version, Authorization, auth, source"
  );
};

// List of public paths
const publicPaths = ["/login", "/api/public"];

export default async function middleware(req: NextRequest) {
  console.log(" Middleware triggered for:", req.nextUrl.pathname);

  const pathname = req.nextUrl.pathname;
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const token = req.cookies.get("token")?.value || null;

  // Allow OPTIONS preflight
  if (req.method === "OPTIONS") {
    const res = NextResponse.json({}, { status: 204 });
    setCORSHeaders(res, origin);
    return res;
  }

  // Allow public paths without auth
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    const res = NextResponse.next();
    setCORSHeaders(res, origin);
    return res;
  }
  console.log("token", token);
  if (!token) {
    console.warn(" No token found. Redirecting to login.");
    const res = NextResponse.redirect(new URL("/login", req.url));
    setCORSHeaders(res, origin);
    return res;
  }

  // Verify token
  const { valid } = await verifyToken(token);
  console.log("valid  user", valid);
  if (!valid) {
    console.warn(" Invalid token. Redirecting to login.");
    const res = NextResponse.redirect(new URL("/login", req.url));
    setCORSHeaders(res, origin);
    return res;
  } else {
    console.log("verified");
  }

  // Optional: add user to request headers (for internal APIs)
  const res = NextResponse.next();
  setCORSHeaders(res, origin);
  //res.headers.set("x-user-info", JSON.stringify(user as UserInfo));
  return res;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
  ],
};
