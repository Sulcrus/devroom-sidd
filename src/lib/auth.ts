import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "./mysql";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  token?: string;
}

export async function getAuthUser(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      console.log("No auth token found");
      return null;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string };

    // Get user with valid session
    const users = await query({
      query: `
        SELECT 
          u.id, u.first_name, u.last_name, u.email, u.username,
          s.token
        FROM users u
        JOIN sessions s ON s.user_id = u.id
        WHERE u.id = ? 
        AND s.token = ? 
        AND s.expires_at > NOW()
      `,
      values: [decoded.userId, token],
    }) as UserRow[];

    if (!users.length) {
      console.log("No valid session found");
      return null;
    }

    return users[0];
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
} 