import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await query({
      query: `
        SELECT 
          id, 
          first_name, 
          last_name, 
          email, 
          phone, 
          date_of_birth,
          gender,
          marital_status
        FROM users
        WHERE id = ?
      `,
      values: [user.id],
    });

    if (!Array.isArray(userData) || userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 