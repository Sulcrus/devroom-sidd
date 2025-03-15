import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";

export async function GET() {
  try {
    await query({ query: "SELECT 1" });
    return NextResponse.json({ status: "healthy" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 