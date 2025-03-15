import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
}

interface StatRow extends RowDataPacket {
  type: 'income' | 'spending';
  amount: number;
}

interface BalanceRow extends RowDataPacket {
  total: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req) as UserRow;
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total balance across all accounts
    const totalBalanceResult = await query({
      query: `
        SELECT SUM(balance) as total
        FROM accounts
        WHERE user_id = ?
      `,
      values: [user.id],
    }) as BalanceRow[];

    // Get monthly income and spending
    const monthlyStats = await query({
      query: `
        SELECT 
          CASE 
            WHEN ta.user_id = ? THEN 'income'
            ELSE 'spending'
          END as type,
          SUM(t.amount) as amount
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY type
      `,
      values: [user.id, user.id, user.id],
    }) as StatRow[];

    // Get transaction stats by date
    const transactionStatsResult = await query({
      query: `
        SELECT 
          DATE(t.created_at) as date,
          SUM(CASE WHEN ta.user_id = ? THEN t.amount ELSE 0 END) as income,
          SUM(CASE WHEN fa.user_id = ? THEN t.amount ELSE 0 END) as spending
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(t.created_at)
        ORDER BY date ASC
      `,
      values: [user.id, user.id, user.id, user.id],
    });

    const monthlyIncome = monthlyStats.find(stat => stat.type === 'income')?.amount || 0;
    const monthlySpending = monthlyStats.find(stat => stat.type === 'spending')?.amount || 0;

    return NextResponse.json({
      totalBalance: totalBalanceResult[0]?.total || 0,
      monthlyIncome,
      monthlySpending,
      transactionStats: transactionStatsResult,
    });

  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 