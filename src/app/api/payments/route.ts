import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateReferenceNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fromAccountId, billerId, amount, category, description } = await req.json();

    // Validate input
    if (!fromAccountId || !billerId || !amount || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    try {
      // Start transaction
      await query({ query: "START TRANSACTION" });

      // Get source account and verify balance
      const [fromAccount] = await query({
        query: `
          SELECT id, balance, currency, status 
          FROM accounts 
          WHERE id = ? AND user_id = ? AND status = 'active'
          FOR UPDATE
        `,
        values: [fromAccountId, user.id],
      });

      if (!fromAccount) {
        throw new Error("Source account not found or inactive");
      }

      if (fromAccount.balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Generate reference number
      const referenceNumber = generateReferenceNumber();
      const transactionId = uuidv4();

      // Create transaction record
      await query({
        query: `
          INSERT INTO transactions (
            id,
            reference_number,
            from_account_id,
            amount,
            type,
            category,
            description,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
        `,
        values: [
          transactionId,
          referenceNumber,
          fromAccountId,
          amount,
          'payment',
          category,
          description || `Payment to ${billerId}`,
        ],
      });

      // Update account balance
      await query({
        query: `
          UPDATE accounts 
          SET balance = balance - ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        values: [amount, fromAccountId],
      });

      // Update monthly statistics
      await query({
        query: `
          INSERT INTO monthly_statistics (
            user_id, 
            type, 
            amount, 
            month, 
            year
          ) VALUES (?, 'spending', ?, MONTH(CURRENT_DATE()), YEAR(CURRENT_DATE()))
          ON DUPLICATE KEY UPDATE amount = amount + ?
        `,
        values: [user.id, amount, amount],
      });

      // Create notification
      await query({
        query: `
          INSERT INTO notifications (
            id,
            user_id,
            title,
            message,
            type
          ) VALUES (?, ?, ?, ?, 'success')
        `,
        values: [
          uuidv4(),
          user.id,
          'Payment Successful',
          `Payment of ${fromAccount.currency} ${amount.toLocaleString()} to ${billerId}`,
        ],
      });

      // Commit transaction
      await query({ query: "COMMIT" });

      return NextResponse.json({
        message: "Payment successful",
        referenceNumber,
      });
    } catch (error: any) {
      // Rollback on error
      await query({ query: "ROLLBACK" });
      throw error;
    }
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 400 }
    );
  }
} 