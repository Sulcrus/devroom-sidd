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
  amount: number;
  type: string;
  status: string;
  created_at: Date;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  from_account_number?: string;
  to_account_number?: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req) as UserRow;
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "week"; // week, month, year
    
    let dateFilter = "";
    switch (period) {
      case "week":
        dateFilter = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
        break;
      case "month":
        dateFilter = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        break;
      case "year":
        dateFilter = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
        break;
    }

    const transactions = await query({
      query: `
        SELECT 
          t.*,
          tc.name as category_name,
          tc.icon as category_icon,
          tc.color as category_color,
          fa.account_number as from_account_number,
          ta.account_number as to_account_number
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        LEFT JOIN transaction_categories tc ON t.category_id = tc.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        ${dateFilter}
        ORDER BY t.created_at DESC
        LIMIT 50
      `,
      values: [user.id, user.id],
    }) as TransactionRow[];

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 