import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateReferenceNumber } from "@/lib/utils";
import { RowDataPacket } from "mysql2";

interface AccountRow extends RowDataPacket {
  id: string;
  user_id: string;
  account_number: string;
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

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
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

    const body = await req.json();
    console.log('Received transfer request:', body);

    const { fromAccountId, toAccountId: recipientUsername, amount, description } = body;

    // Validate input
    if (!fromAccountId) {
      return NextResponse.json(
        { error: "Source account is required" },
        { status: 400 }
      );
    }

    if (!recipientUsername) {
      return NextResponse.json(
        { error: "Recipient username is required" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 }
      );
    }

    try {
      // Start transaction
      await query({ query: "START TRANSACTION" });

      // Get source account
      const [fromAccount] = await query({
        query: `
          SELECT * FROM accounts 
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

      // Get recipient user by username
      const [recipientUser] = await query({
        query: "SELECT * FROM users WHERE username = ?",
        values: [recipientUsername],
      }) as UserRow[];

      if (!recipientUser) {
        throw new Error("Recipient not found");
      }

      if (recipientUser.id === user.id) {
        throw new Error("Cannot transfer to yourself");
      }

      // Get recipient's default account
      const [toAccount] = await query({
        query: `
          SELECT * FROM accounts 
          WHERE user_id = ? AND status = 'active'
          ORDER BY created_at ASC
          LIMIT 1
          FOR UPDATE
        `,
        values: [recipientUser.id],
      }) as AccountRow[];

      if (!toAccount) {
        throw new Error("Recipient has no active account");
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
          fromAccount.id,
          toAccount.id,
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
        values: [amount, fromAccount.id],
      });

      await query({
        query: `
          UPDATE accounts 
          SET balance = balance + ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        values: [amount, toAccount.id],
      });

      // Create notifications
      await query({
        query: `
          INSERT INTO notifications (id, user_id, title, message, type)
          VALUES 
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?)
        `,
        values: [
          uuidv4(),
          user.id,
          'Transfer Sent',
          `You sent ${fromAccount.currency} ${amount.toLocaleString()} to @${recipientUser.username}`,
          'success',
          uuidv4(),
          recipientUser.id,
          'Transfer Received',
          `You received ${toAccount.currency} ${amount.toLocaleString()} from @${user.username}`,
          'success'
        ],
      });

      // Commit transaction
      await query({ query: "COMMIT" });

      return NextResponse.json({
        message: "Transfer successful",
        referenceNumber,
        recipientName: `${recipientUser.first_name} ${recipientUser.last_name}`
      });

    } catch (error) {
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