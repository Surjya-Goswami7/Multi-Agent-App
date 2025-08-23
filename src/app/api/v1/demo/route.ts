import { NextRequest, NextResponse } from "next/server";
import pool from "../../../utils/db";
import { RowDataPacket } from "mysql2";

export const GET = async () => {
    const connection = await pool.getConnection();
    try {
        const [AllUsers] = await connection.execute("SELECT * FROM users") as RowDataPacket[];
        console.log(AllUsers, ' ======the data');

        return NextResponse.json({ status: 200, data: AllUsers });
    } catch (error) {
        console.error("error occured", error);
        return NextResponse.json({ status: 500, message: "something went wrong" });
    } finally {
        connection.release();
    }
}