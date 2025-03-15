import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Remove all sessions for this token
    await query({
      query: "DELETE FROM sessions WHERE token = ?",
      values: [token],
    });

    // Clear cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Make sure to clear the cookie properly
    response.cookies.delete("auth_token", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 