import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
}

interface AccountRow extends RowDataPacket {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  currency: string;
  status: string;
  created_at: Date;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req) as UserRow;
    
    if (!user) {
      console.log("No authenticated user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching accounts for user:", user.id);

    const accounts = await query({
      query: `
        SELECT * FROM accounts 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `,
      values: [user.id],
    }) as AccountRow[];

    console.log("Found accounts:", accounts.length);

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 