import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "auth"; // your JWT verify helper
import type { UserInfo } from "app/utils/common/type"; // adjust path

// ✅ Allowed origins for CORS
const allowedOrigins: string[] = ["http://localhost:3000"];

function setCORSHeaders(res: NextResponse, origin: string | null): void {
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
}

// ✅ Public routes (skip auth check)
const publicPaths = ["/", "/login", "/api/v1"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin =
    req.headers.get("origin") || req.headers.get("referer") || null;
  const token = req.cookies.get("token")?.value ?? null;

  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    const res = NextResponse.json({}, { status: 204 });
    setCORSHeaders(res, origin);
    return res;
  }

  // ✅ Allow public routes without auth
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    const res = NextResponse.next();
    setCORSHeaders(res, origin);
    return res;
  }

  // ✅ No token → redirect to /login
  if (!token) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    setCORSHeaders(res, origin);
    return res;
  }

  // ✅ Verify JWT token
  try {
    const { valid, user } = await verifyToken(token);

    if (!valid) {
      console.warn("[MIDDLEWARE] Invalid/expired token → redirect to /login");
      const res = NextResponse.redirect(new URL("/login", req.url));
      setCORSHeaders(res, origin);
      return res;
    }

    // ✅ Valid token → allow access
    const res = NextResponse.next();
    setCORSHeaders(res, origin);

    // Optional: Pass user info to downstream APIs
    if (user) {
      res.headers.set("x-user-info", JSON.stringify(user as UserInfo));
    }

    return res;
  } catch (err) {
    console.error("[MIDDLEWARE] Error verifying token:", err);
    const res = NextResponse.redirect(new URL("/login", req.url));
    setCORSHeaders(res, origin);
    return res;
  }
}

// ✅ Apply middleware only on protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/api/protected/:path*",
  ],
};
