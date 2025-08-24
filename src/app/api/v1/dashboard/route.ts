import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "auth";
import pool from "../../../utils/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const { valid, user } = await verifyToken(token);

  if (!valid || !user) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT total_credits, outstanding_credits FROM user_credits WHERE user_id = ?",
      [user.userId]
    );
    console.log("Query result:", rows);

    const credits = rows.length > 0 ? rows[0].outstanding_credits : 0;
    const totalCredits = rows.length > 0 ? rows[0].total_credits : 0;

    const dashboardData = {
      message: `Welcome ${user.email}`,
      stats: {
        projects: 5,
        tasksCompleted: 12,
        pendingTasks: 3,
      },
      userInfo: {
        name: user.name,
        email: user.email,
        credits: credits, // outstanding credits
        totalCredits: totalCredits,
      },
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
