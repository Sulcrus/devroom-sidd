import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove session
    await query({
      sql: "DELETE FROM sessions WHERE user_id = ?",
      values: [user.id],
    });

    // Clear cookie
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
} 