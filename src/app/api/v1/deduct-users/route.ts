import { NextResponse, NextRequest } from "next/server";
import pool from "../../../utils/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    // 🔥 Get user info from middleware
    const userId = req.headers.get("x-user-id");
    const email = req.headers.get("x-user-email");
    
    console.log('userId', userId, ' =============email', email);
    if (!userId || !email) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized - No user found" },
        { status: 401 }
      );
    }

    // Fetch user credits
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT uc.user_id, uc.total_credits, uc.outstanding_credits
       FROM user_credits uc
       WHERE uc.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { status: 404, message: "Credits not found" },
        { status: 404 }
      );
    }

    const currentCredits = rows[0].total_credits;
    const outstanding = rows[0].outstanding_credits;

    if (currentCredits < 2) {
      return NextResponse.json(
        { status: 403, message: "No credits left. Please buy more credits." },
        { status: 403 }
      );
    }

    const updatedTotal = currentCredits - 2;
    const updatedOutstanding = outstanding - 2;

    // Deduct credits
    await connection.execute(
      "UPDATE user_credits SET total_credits = ?, outstanding_credits = ? WHERE user_id = ?",
      [updatedTotal, updatedOutstanding, rows[0].user_id]
    );

    return NextResponse.json(
      {
        status: 200,
        message: "2 credits deducted successfully",
        remainingCredits: updatedTotal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Credit deduction error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function GET(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    // 🔥 Get user info from middleware
    const userId = req.headers.get("x-user-id");
    const email = req.headers.get("x-user-email");

    if (!userId || !email) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized - No user found" },
        { status: 401 }
      );
    }

    // Fetch credits for dashboard
    const [rows] = await connection.execute<RowDataPacket[]>(
      `SELECT uc.total_credits, uc.outstanding_credits
       FROM user_credits uc
       WHERE uc.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { status: 404, message: "Credits not found" },
        { status: 404 }
      );
    }

    const credits = rows[0].outstanding_credits || 0;
    const totalCredits = rows[0].total_credits || 0;

    return NextResponse.json(
      { status: 200, credits, totalCredits },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch credits error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
