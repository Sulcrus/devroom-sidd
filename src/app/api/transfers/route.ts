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

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
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
      // First, find the recipient user
      const [recipientUser] = await query({
        query: "SELECT * FROM users WHERE username = ?",
        values: [recipientUsername],
      }) as UserRow[];

      if (!recipientUser) {
        return NextResponse.json(
          { error: "Recipient not found" },
          { status: 404 }
        );
      }

      if (recipientUser.id === user.id) {
        return NextResponse.json(
          { error: "Cannot transfer to yourself" },
          { status: 400 }
        );
      }

      // Find recipient's primary account
      const [recipientAccount] = await query({
        query: `
          SELECT * FROM accounts 
          WHERE user_id = ? AND status = 'active'
          ORDER BY created_at ASC 
          LIMIT 1
        `,
        values: [recipientUser.id],
      }) as AccountRow[];

      if (!recipientAccount) {
        return NextResponse.json(
          { error: "Recipient has no active account" },
          { status: 404 }
        );
      }

      // Get sender's account
      const [senderAccount] = await query({
        query: "SELECT * FROM accounts WHERE id = ? AND user_id = ? AND status = 'active'",
        values: [fromAccountId, user.id],
      }) as AccountRow[];

      if (!senderAccount) {
        return NextResponse.json(
          { error: "Source account not found or inactive" },
          { status: 404 }
        );
      }

      if (senderAccount.balance < amount) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      // Generate transaction reference
      const referenceNumber = generateReferenceNumber();

      // Create transaction record
      await query({
        query: `
          INSERT INTO transactions (
            id,
            from_account_id,
            to_account_id,
            amount,
            type,
            status,
            description,
            reference_number,
            created_at
          ) VALUES (?, ?, ?, ?, 'transfer', 'completed', ?, ?, CURRENT_TIMESTAMP)
        `,
        values: [
          uuidv4(),
          senderAccount.id,
          recipientAccount.id,
          amount,
          description || 'Transfer',
          referenceNumber
        ],
      });

      // Update sender's balance
      await query({
        query: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        values: [amount, senderAccount.id],
      });

      // Update recipient's balance
      await query({
        query: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        values: [amount, recipientAccount.id],
      });

      // Create notifications
      await query({
        query: `
          INSERT INTO notifications (
            id, 
            user_id, 
            title, 
            message, 
            type, 
            is_read,
            created_at
          )
          VALUES 
            (?, ?, 'Transfer Sent', ?, 'success', 0, CURRENT_TIMESTAMP),
            (?, ?, 'Transfer Received', ?, 'success', 0, CURRENT_TIMESTAMP)
        `,
        values: [
          uuidv4(),
          user.id,
          `You sent ${senderAccount.currency} ${amount.toLocaleString()} to @${recipientUser.username}`,
          uuidv4(),
          recipientUser.id,
          `You received ${recipientAccount.currency} ${amount.toLocaleString()} from @${user.username}`
        ],
      });

      return NextResponse.json({
        message: "Transfer successful",
        referenceNumber,
        recipientName: `${recipientUser.first_name} ${recipientUser.last_name}`
      });

    } catch (error) {
      console.error("Transfer error:", error);
      return NextResponse.json(
        { error: "Transfer failed. Please try again." },
        { status: 500 }
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