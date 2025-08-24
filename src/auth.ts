import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";
import { UserInfo } from "app/utils/common/type";

const SECRET_KEY = process.env.JWT_SECRET || "";

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/**
 * Verify token and return decoded payload
 */
export async function verifyToken(token: string): Promise<{
  valid: boolean;
  user?: UserInfo;
}> {
  try {
    if (!token) {
      return { valid: false };
    }

    const secret = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    return {
      valid: true,
      user: payload as unknown as UserInfo, // Cast payload to your user type
    };
  } catch (err) {
    console.error("JWT verification failed:", err);
    return { valid: false };
  }
}
