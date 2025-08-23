import db from "app/utils/db";
import passwordUtils from "app/utils/encryptPassword";
import { RowDataPacket } from "mysql2";

export async function POST(req: { json: () => any }) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword } = body;

    if (!email) {
      return Response.json({ message: "Email is required" }, { status: 200 });
    }

    // for  check user
    if (email && !password && !confirmPassword) {
      const [rows] = await db.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (rows.length > 0) {
        return Response.json(
          { exists: true, message: "User exists" },
          { status: 200 }
        );
      } else {
        return Response.json(
          { exists: false, message: "User not found" },
          { status: 200 }
        );
      }
    }

    // for forgot password
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return Response.json(
          { message: "Passwords do not match" },
          { status: 200 }
        );
      }

      const [user] = await db.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (!user || user.length === 0) {
        return Response.json({ message: "User not found" }, { status: 200 });
      }

      const hashed = await passwordUtils.encryptPassword(password);
      await db.query("UPDATE users SET user_password = ? WHERE email = ?", [
        hashed,
        email,
      ]);

      return Response.json(
        { message: "Password Updated Successfully" },
        { status: 200 }
      );
    }

    return Response.json({ message: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
