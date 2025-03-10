import { NextRequest } from "next/server";
import { query } from "@/lib/mysql";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/types";

export async function getAuthUser(req: NextRequest | Request): Promise<User | null> {
  try {
    // Get token from cookie
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as { userId: string };

    // Get user from database
    const [user] = await query({
      query: `
        SELECT id, first_name, last_name, email, username, created_at, updated_at
        FROM users 
        WHERE id = ?
      `,
      values: [decoded.userId],
    }) as User[];

    return user || null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
} 