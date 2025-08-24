import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "auth"; // your helper

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false, user: null }, { status: 401 });
  }

  const { valid, user } = await verifyToken(token);
  //get the user from verify token and sent the response with user

  if (!valid) {
    return NextResponse.json({ loggedIn: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true, user: user }, { status: 200 });
}
