import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
}

interface TransactionRow extends RowDataPacket {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number | string;
  type: string;
  status: string;
  created_at: Date;
  description: string;
  reference_number: string;
  from_account_number?: string;
  to_account_number?: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req) as UserRow;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await query({
      query: `
        SELECT 
          t.id,
          t.from_account_id,
          t.to_account_id,
          FORMAT(t.amount, 2) as amount,
          t.type,
          t.status,
          t.created_at,
          t.description,
          t.reference_number,
          fa.account_number as from_account_number,
          ta.account_number as to_account_number
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        ORDER BY t.created_at DESC
        LIMIT 50
      `,
      values: [user.id, user.id],
    }) as TransactionRow[];

    // Format amounts to remove leading zeros and ensure proper decimal places
    const formattedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(parseFloat(t.amount as string).toFixed(2))
    }));

    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 