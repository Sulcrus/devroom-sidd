import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "./mysql";

export async function getAuthUser(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string };

    // Get user
    const users = await query({
      query: `
        SELECT u.*, s.token 
        FROM users u
        JOIN sessions s ON s.user_id = u.id
        WHERE u.id = ? AND s.token = ? AND s.expires_at > NOW()
      `,
      values: [decoded.userId, token],
    });

    return Array.isArray(users) && users[0];
  } catch (error) {
    return null;
  }
} 