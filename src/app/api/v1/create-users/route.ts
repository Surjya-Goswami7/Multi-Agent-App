import { NextRequest, NextResponse } from "next/server";
import pool from "../../../utils/db";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

type user = RowDataPacket & {
  id: Number;
  full_name: String;
  email: String;
  user_password: String;
  user_session: Number;
};

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    const { full_name, email, password } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { status: 400, message: "All fields are required" },
        { status: 400 }
      );
    }

    const [existingUser] = await connection.execute<user[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { status: 409, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Capture insert result
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO users (full_name, email, user_password, user_session) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, 1]
    );

    // Get inserted userId
    const userId = result.insertId;

    // Assign 10 free credits to the new user
    await connection.execute(
      "INSERT INTO user_credits (user_id, total_credits, outstanding_credits) VALUES (?, ?, ?)",
      [userId, 10, 10]
    );

    return NextResponse.json(
      { status: 201, message: "User created successfully", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
