import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  password: string;
  username: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Get user
    const users = await query({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    }) as UserRow[];

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await query({
      query: `
        INSERT INTO sessions (id, user_id, token, expires_at)
        VALUES (?, ?, ?, ?)
      `,
      values: [sessionId, user.id, token, expiresAt],
    });

    // Set cookie
    const response = NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("Set auth cookie:", token);

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 