import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalBalance,
      monthlyStats,
      spendingByCategory,
      transactionStats
    ] = await Promise.all([
      // Get total balance
      query({
        sql: `
          SELECT SUM(balance) as total
          FROM accounts
          WHERE user_id = ? AND status = 'active'
        `,
        values: [user.id],
      }),

      // Get monthly income and spending
      query({
        sql: `
          SELECT 
            'income' as type,
            COALESCE(SUM(CASE 
              WHEN t.to_account_id IN (SELECT id FROM accounts WHERE user_id = ?) 
              THEN t.amount ELSE 0 
            END), 0) as amount
          FROM transactions t
          WHERE MONTH(t.created_at) = MONTH(CURRENT_DATE())
          AND YEAR(t.created_at) = YEAR(CURRENT_DATE())
          UNION ALL
          SELECT 
            'spending' as type,
            COALESCE(SUM(CASE 
              WHEN t.from_account_id IN (SELECT id FROM accounts WHERE user_id = ?) 
              THEN t.amount ELSE 0 
            END), 0) as amount
          FROM transactions t
          WHERE MONTH(t.created_at) = MONTH(CURRENT_DATE())
          AND YEAR(t.created_at) = YEAR(CURRENT_DATE())
        `,
        values: [user.id, user.id],
      }),

      // Get spending by category
      query({
        sql: `
          SELECT 
            tc.name as category,
            tc.color,
            SUM(t.amount) as amount
          FROM transactions t
          JOIN transaction_categories tc ON t.category_id = tc.id
          JOIN accounts a ON t.from_account_id = a.id
          WHERE a.user_id = ?
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          GROUP BY tc.id
          ORDER BY amount DESC
        `,
        values: [user.id],
      }),

      // Get daily transaction stats
      query({
        sql: `
          SELECT 
            DATE(t.created_at) as date,
            SUM(CASE WHEN a_to.user_id = ? THEN t.amount ELSE 0 END) as income,
            SUM(CASE WHEN a_from.user_id = ? THEN t.amount ELSE 0 END) as spending
          FROM transactions t
          LEFT JOIN accounts a_from ON t.from_account_id = a_from.id
          LEFT JOIN accounts a_to ON t.to_account_id = a_to.id
          WHERE (a_from.user_id = ? OR a_to.user_id = ?)
          AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
          GROUP BY DATE(t.created_at)
          ORDER BY date ASC
        `,
        values: [user.id, user.id, user.id, user.id],
      }),
    ]);

    // Get monthly totals from the results
    const monthlyIncome = monthlyStats.find((stat: any) => stat.type === 'income')?.amount || 0;
    const monthlySpending = monthlyStats.find((stat: any) => stat.type === 'spending')?.amount || 0;

    // Calculate percentages for spending by category
    const totalSpent = spendingByCategory.reduce((sum: number, cat: any) => sum + cat.amount, 0);
    const categoriesWithPercentages = spendingByCategory.map((cat: any) => ({
      ...cat,
      percentage: totalSpent ? (cat.amount / totalSpent) * 100 : 0
    }));

    return NextResponse.json({
      totalBalance: totalBalance[0]?.total || 0,
      monthlyIncome,
      monthlySpending,
      transactionStats,
      spendingByCategory: categoriesWithPercentages,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 