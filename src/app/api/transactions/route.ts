import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await query({
      sql: `
        SELECT 
          t.*,
          tc.name as category_name,
          tc.icon as category_icon,
          tc.color as category_color,
          a_from.account_number as from_account_number,
          a_to.account_number as to_account_number
        FROM transactions t
        LEFT JOIN transaction_categories tc ON t.category_id = tc.id
        LEFT JOIN accounts a_from ON t.from_account_id = a_from.id
        LEFT JOIN accounts a_to ON t.to_account_id = a_to.id
        WHERE a_from.user_id = ? OR a_to.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT 50
      `,
      values: [user.id, user.id],
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 