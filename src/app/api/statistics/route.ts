import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface AccountRow extends RowDataPacket {
  total_balance: number;
}

interface TransactionRow extends RowDataPacket {
  date: string;
  income: number;
  spending: number;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total balance
    const [balanceResult] = await query({
      query: `
        SELECT SUM(balance) as total_balance 
        FROM accounts 
        WHERE user_id = ? AND status = 'active'
      `,
      values: [user.id],
    }) as AccountRow[];

    // Get monthly income and spending
    const [monthlyStats] = await query({
      query: `
        SELECT 
          COALESCE(SUM(CASE 
            WHEN ta.user_id = ? THEN t.amount 
            ELSE 0 
          END), 0) as monthly_income,
          COALESCE(SUM(CASE 
            WHEN fa.user_id = ? THEN t.amount 
            ELSE 0 
          END), 0) as monthly_spending
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `,
      values: [user.id, user.id, user.id, user.id],
    }) as RowDataPacket[];

    // Get daily transaction stats
    const transactionStats = await query({
      query: `
        SELECT 
          DATE(t.created_at) as date,
          COALESCE(SUM(CASE 
            WHEN ta.user_id = ? THEN t.amount 
            ELSE 0 
          END), 0) as income,
          COALESCE(SUM(CASE 
            WHEN fa.user_id = ? THEN t.amount 
            ELSE 0 
          END), 0) as spending
        FROM transactions t
        LEFT JOIN accounts fa ON t.from_account_id = fa.id
        LEFT JOIN accounts ta ON t.to_account_id = ta.id
        WHERE (fa.user_id = ? OR ta.user_id = ?)
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(t.created_at)
        ORDER BY date DESC
      `,
      values: [user.id, user.id, user.id, user.id],
    }) as TransactionRow[];

    // Get spending by type
    const spendingByType = await query({
      query: `
        SELECT 
          t.type,
          COALESCE(SUM(t.amount), 0) as amount
        FROM transactions t
        JOIN accounts a ON t.from_account_id = a.id
        WHERE a.user_id = ?
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY t.type
      `,
      values: [user.id],
    }) as RowDataPacket[];

    // Calculate total spending for percentages
    const totalSpending = spendingByType.reduce((sum: number, item: any) => sum + item.amount, 0);

    return NextResponse.json({
      totalBalance: balanceResult.total_balance || 0,
      monthlyIncome: monthlyStats.monthly_income || 0,
      monthlySpending: monthlyStats.monthly_spending || 0,
      transactionStats,
      spendingByType: spendingByType.map((item: any) => ({
        type: item.type,
        amount: item.amount,
        percentage: totalSpending ? (item.amount / totalSpending * 100) : 0
      }))
    });

  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
} 