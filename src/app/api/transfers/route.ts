import { NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateReferenceNumber } from "@/lib/utils";

async function createNotification(userId: string, title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') {
  await query({
    query: `
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `,
    values: [uuidv4(), userId, title, message, type],
  });
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fromAccountId, toUsername, amount, description } = await req.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid transfer amount" },
        { status: 400 }
      );
    }

    // Start transaction
    await query({ query: "START TRANSACTION" });

    try {
      // Check if source account exists and belongs to user
      const [fromAccount] = await query({
        query: `
          SELECT id, balance, status, currency
          FROM accounts 
          WHERE id = ? AND user_id = ? AND status = 'active'
        `,
        values: [fromAccountId, user.id],
      });

      if (!fromAccount) {
        throw new Error("Source account not found or inactive");
      }

      // Find recipient's default account by username
      const [recipientAccount] = await query({
        query: `
          SELECT a.id, a.status, a.currency, u.username, u.first_name, u.last_name
          FROM accounts a
          JOIN users u ON a.user_id = u.id
          WHERE u.username = ? 
          AND a.status = 'active'
          AND a.account_type = 'savings'
          LIMIT 1
        `,
        values: [toUsername],
      });

      if (!recipientAccount) {
        throw new Error("Recipient not found or has no active account");
      }

      if (fromAccount.id === recipientAccount.id) {
        throw new Error("Cannot transfer to the same account");
      }

      // Check sufficient balance
      if (fromAccount.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const transactionId = uuidv4();
      const referenceNumber = generateReferenceNumber();

      // Update balances
      await query({
        query: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        values: [amount, fromAccount.id],
      });

      await query({
        query: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        values: [amount, recipientAccount.id],
      });

      // Record transaction
      await query({
        query: `
          INSERT INTO transactions (
            id, from_account_id, to_account_id, amount, 
            type, status, description, reference_number,
            category_id
          ) VALUES (?, ?, ?, ?, 'transfer', 'completed', ?, ?, 
            (SELECT id FROM transaction_categories WHERE name = 'Transfer')
          )
        `,
        values: [
          transactionId,
          fromAccount.id,
          recipientAccount.id,
          amount,
          description,
          referenceNumber,
        ],
      });

      // Update monthly statistics for sender (spending)
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

      // Update monthly statistics for recipient (income)
      await query({
        query: `
          INSERT INTO monthly_statistics (
            user_id, 
            type, 
            amount, 
            month, 
            year
          ) VALUES (?, 'income', ?, MONTH(CURRENT_DATE()), YEAR(CURRENT_DATE()))
          ON DUPLICATE KEY UPDATE amount = amount + ?
        `,
        values: [recipientAccount.user_id, amount, amount],
      });

      // Create notifications
      await createNotification(
        user.id,
        'Money Sent',
        `You sent ${fromAccount.currency} ${amount.toLocaleString()} to ${recipientAccount.first_name} ${recipientAccount.last_name}`,
        'success'
      );

      await createNotification(
        recipientAccount.user_id,
        'Money Received',
        `You received ${fromAccount.currency} ${amount.toLocaleString()} from ${user.first_name} ${user.last_name}`,
        'success'
      );

      await query({ query: "COMMIT" });

      return NextResponse.json({
        message: "Transfer successful",
        referenceNumber,
        recipientName: `${recipientAccount.first_name} ${recipientAccount.last_name}`,
      });
    } catch (error: any) {
      await query({ query: "ROLLBACK" });
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 