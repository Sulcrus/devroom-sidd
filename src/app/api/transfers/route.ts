import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateReferenceNumber } from "@/lib/utils";
import { RowDataPacket } from "mysql2";

interface AccountRow extends RowDataPacket {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: string;
}

interface TransferRow extends RowDataPacket {
  id: string;
  reference_number: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

async function createNotification(userId: string, title: string, message: string, type: 'success' | 'warning' | 'error' | 'info') {
  await query({
    query: `
      INSERT INTO notifications (id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `,
    values: [uuidv4(), userId, title, message, type],
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fromAccountId, toAccountId, amount, description } = await req.json();

    // Validate input
    if (!fromAccountId || !toAccountId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (fromAccountId === toAccountId) {
      return NextResponse.json(
        { error: "Cannot transfer to same account" },
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
      }) as AccountRow[];

      if (!fromAccount) {
        throw new Error("Source account not found or inactive");
      }

      if (fromAccount.balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Get destination account
      const [toAccount] = await query({
        query: `
          SELECT id, currency, status 
          FROM accounts 
          WHERE id = ? AND status = 'active'
          FOR UPDATE
        `,
        values: [toAccountId],
      }) as AccountRow[];

      if (!toAccount) {
        throw new Error("Destination account not found or inactive");
      }

      // Generate reference number
      const referenceNumber = generateReferenceNumber();
      const transferId = uuidv4();

      // Create transfer record
      await query({
        query: `
          INSERT INTO transfers (
            id,
            reference_number,
            from_account_id,
            to_account_id,
            amount,
            description,
            status
          ) VALUES (?, ?, ?, ?, ?, ?, 'completed')
        `,
        values: [
          transferId,
          referenceNumber,
          fromAccountId,
          toAccountId,
          amount,
          description || 'Transfer',
        ],
      });

      // Update account balances
      await query({
        query: `
          UPDATE accounts 
          SET balance = balance - ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        values: [amount, fromAccountId],
      });

      await query({
        query: `
          UPDATE accounts 
          SET balance = balance + ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        values: [amount, toAccountId],
      });

      // Create notifications for both parties
      await createNotification(
        user.id,
        'Transfer Sent',
        `You sent ${fromAccount.currency} ${amount.toLocaleString()} to account ending in ${toAccountId.slice(-4)}`,
        'success'
      );

      const [toAccountOwner] = await query({
        query: "SELECT user_id FROM accounts WHERE id = ?",
        values: [toAccountId],
      }) as AccountRow[];

      if (toAccountOwner && toAccountOwner.user_id !== user.id) {
        await createNotification(
          toAccountOwner.user_id,
          'Transfer Received',
          `You received ${toAccount.currency} ${amount.toLocaleString()} from account ending in ${fromAccountId.slice(-4)}`,
          'success'
        );
      }

      // Commit transaction
      await query({ query: "COMMIT" });

      return NextResponse.json({
        message: "Transfer successful",
        referenceNumber,
      });
    } catch (error: any) {
      // Rollback on error
      await query({ query: "ROLLBACK" });
      throw error;
    }
  } catch (error: any) {
    console.error("Transfer error:", error);
    return NextResponse.json(
      { error: error.message || "Transfer failed" },
      { status: 400 }
    );
  }
} 