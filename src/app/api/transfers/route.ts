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

const BLUE_BOX_QUOTES = [
  "Like a serve that connects us, this transfer reaches its mark",
  "Supporting each other's dreams, one transfer at a time",
  "Growing stronger together, like Taiki and Chinatsu",
  "A small step forward in our journey",
  "Building connections, box by box",
  "Like the perfect shot in badminton",
  "Reaching across courts to support each other",
  "Every transfer is a step toward our dreams",
  "Connected by more than just transactions",
  "Supporting your path to victory"
];

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

    // Start transaction
    await query({ query: "START TRANSACTION" });

    try {
      // Find recipient user
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

      // Get sender's account
      const [senderAccount] = await query({
        query: "SELECT * FROM accounts WHERE id = ? AND user_id = ? AND status = 'active' FOR UPDATE",
        values: [fromAccountId, user.id],
      }) as AccountRow[];

      if (!senderAccount) {
        throw new Error("Source account not found or inactive");
      }

      if (senderAccount.balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Find recipient's primary account
      const [recipientAccount] = await query({
        query: `
          SELECT * FROM accounts 
          WHERE user_id = ? AND status = 'active'
          ORDER BY created_at ASC 
          LIMIT 1
          FOR UPDATE
        `,
        values: [recipientUser.id],
      }) as AccountRow[];

      if (!recipientAccount) {
        throw new Error("Recipient has no active account");
      }

      // Generate reference number with Blue Box theme
      const referenceNumber = `BX${generateReferenceNumber()}`;
      const transactionId = uuidv4();
      const randomQuote = BLUE_BOX_QUOTES[Math.floor(Math.random() * BLUE_BOX_QUOTES.length)];

      // Create transaction record with Blue Box theme
      await query({
        query: `
          INSERT INTO transactions (
            id, from_account_id, to_account_id, 
            amount, type, status, 
            description, reference_number, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `,
        values: [
          transactionId,
          senderAccount.id,
          recipientAccount.id,
          amount,
          'transfer',
          'completed',
          description || 'Blue Box Transfer',
          referenceNumber
        ],
      });

      // Update balances
      await query({
        query: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        values: [amount, senderAccount.id],
      });

      await query({
        query: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        values: [amount, recipientAccount.id],
      });

      // Create themed notifications
      await query({
        query: `
          INSERT INTO notifications (id, user_id, title, message, type, created_at)
          VALUES 
            (?, ?, 'Blue Box Transfer', ?, 'success', CURRENT_TIMESTAMP),
            (?, ?, 'Blue Box Received', ?, 'success', CURRENT_TIMESTAMP)
        `,
        values: [
          uuidv4(),
          user.id,
          `${randomQuote}\nYou sent ${senderAccount.currency} ${amount.toLocaleString()} to @${recipientUser.username}`,
          uuidv4(),
          recipientUser.id,
          `${randomQuote}\nYou received ${recipientAccount.currency} ${amount.toLocaleString()} from @${user.username}`
        ],
      });

      // Commit transaction
      await query({ query: "COMMIT" });

      return NextResponse.json({
        message: "Blue Box Transfer successful",
        referenceNumber,
        recipientName: `${recipientUser.first_name} ${recipientUser.last_name}`,
        quote: randomQuote
      });

    } catch (error) {
      // Rollback on error
      await query({ query: "ROLLBACK" });
      console.error("Blue Box Transfer error:", error);
      return NextResponse.json(
        { 
          error: error instanceof Error 
            ? error.message 
            : "Transfer failed. Like in badminton, sometimes we need another serve.",
        },
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