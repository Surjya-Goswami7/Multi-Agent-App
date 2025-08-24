import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../utils/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type User = RowDataPacket & {
  //id: number;
  full_name: string;
  email: string;
  user_password: string;
};
const SECRET_KEY: string = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: "Email and password are required" },
        { status: 400 }
      );
    }
    // use join query with user-credits
    const [rows] = await connection.execute<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { status: 404, message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];


    const passwordMatch = await bcrypt.compare(password, user.user_password);

    if (!passwordMatch) {
      return NextResponse.json(
        { status: 401, message: "Password Not Match" },
        { status: 401 }
      );
    }
    //add user credit here
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: "user",
        name: user.full_name,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    const response = NextResponse.json({
      status: 200,
      message: "Login successful",
      user: {
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  } finally {
    connection.release();
  }
}
