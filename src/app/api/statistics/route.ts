import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Combine all statistics in a single query for better performance
    const [results] = await query({
      query: `
        WITH user_accounts AS (
          SELECT id 
          FROM accounts 
          WHERE user_id = ? AND status = 'active'
        ),
        monthly_stats AS (
          SELECT 
            SUM(CASE WHEN t.to_account_id IN (SELECT id FROM user_accounts) THEN t.amount ELSE 0 END) as income,
            SUM(CASE WHEN t.from_account_id IN (SELECT id FROM user_accounts) THEN t.amount ELSE 0 END) as spending
          FROM transactions t
          WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ),
        daily_stats AS (
          SELECT 
            DATE(t.created_at) as date,
            SUM(CASE WHEN t.to_account_id IN (SELECT id FROM user_accounts) THEN t.amount ELSE 0 END) as income,
            SUM(CASE WHEN t.from_account_id IN (SELECT id FROM user_accounts) THEN t.amount ELSE 0 END) as spending
          FROM transactions t
          WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY DATE(t.created_at)
        ),
        type_stats AS (
          SELECT 
            t.type,
            SUM(t.amount) as amount
          FROM transactions t
          WHERE t.from_account_id IN (SELECT id FROM user_accounts)
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          GROUP BY t.type
        ),
        balance AS (
          SELECT SUM(balance) as total_balance
          FROM accounts
          WHERE user_id = ? AND status = 'active'
        )
        SELECT 
          (SELECT total_balance FROM balance) as total_balance,
          (SELECT income FROM monthly_stats) as monthly_income,
          (SELECT spending FROM monthly_stats) as monthly_spending,
          (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'date', date,
              'income', income,
              'spending', spending
            )
          ) FROM daily_stats) as transaction_stats,
          (SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'type', type,
              'amount', amount
            )
          ) FROM type_stats) as spending_by_type
      `,
      values: [user.id, user.id]
    }) as RowDataPacket[];

    const stats = results[0];
    const transactionStats = JSON.parse(stats.transaction_stats || '[]');
    const spendingByType = JSON.parse(stats.spending_by_type || '[]');

    // Calculate percentages
    const totalSpending = spendingByType.reduce((sum: number, item: any) => sum + item.amount, 0);
    const spendingWithPercentages = spendingByType.map((item: any) => ({
      ...item,
      percentage: totalSpending ? (item.amount / totalSpending * 100) : 0
    }));

    return NextResponse.json({
      totalBalance: stats.total_balance || 0,
      monthlyIncome: stats.monthly_income || 0,
      monthlySpending: stats.monthly_spending || 0,
      transactionStats,
      spendingByType: spendingWithPercentages
    });

  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
} 