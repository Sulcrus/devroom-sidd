import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req) as UserRow;
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get full user data
    const users = await query({
      query: `
        SELECT 
          id, first_name, last_name, email, username,
          phone, date_of_birth, gender, marital_status
        FROM users 
        WHERE id = ?
      `,
      values: [user.id],
    }) as UserRow[];

    if (!users.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 