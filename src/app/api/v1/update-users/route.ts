import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../utils/db'; 
import { ResultSetHeader } from 'mysql2';

export async function PUT(
  req: NextRequest,
 
) {
  //console.log("hi", params);
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');
  const body = await req.json();
  const { full_name, email } = body;

  const connection = await pool.getConnection();
  try {
    if (!email || email === '') {
      return NextResponse.json({ status: 404, message: "email is required" });
    }
    
    let [operation] = await connection.execute(
      
      'UPDATE users SET full_name = ?, email = ? WHERE email = ?',
      [full_name, email, userEmail]
    ) as ResultSetHeader[];
    if (operation.affectedRows === 0) {
      return NextResponse.json({status: 400, message: 'User not found',});
    }
    console.log("hi", operation.affectedRows);
    

    return NextResponse.json({status: 200, message: 'User Updated Successfully',});
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' },{ status: 500 });
  } finally {
    connection.release();
  }
}
