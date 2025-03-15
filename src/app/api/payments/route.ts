import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateReferenceNumber } from "@/lib/utils";
import { RowDataPacket } from "mysql2";

interface PaymentRow extends RowDataPacket {
  id: string;
  user_id: string;
  amount: number;
  reference_number: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

interface AccountRow extends RowDataPacket {
  id: string;
  balance: number;
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

    const { amount, accountId, paymentType } = await req.json();

    // Validate input
    if (!amount || !accountId || !paymentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get account
    const accounts = await query({
      query: "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
      values: [accountId, user.id],
    }) as AccountRow[];

    const account = accounts[0];

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Check balance
    if (account.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 }
      );
    }

    // Create payment
    const paymentId = uuidv4();
    const referenceNumber = generateReferenceNumber();

    await query({
      query: `
        INSERT INTO payments (id, user_id, account_id, amount, type, reference_number)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [paymentId, user.id, accountId, amount, paymentType, referenceNumber],
    });

    // Update account balance
    await query({
      query: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      values: [amount, accountId],
    });

    // Create notification
    await createNotification(
      user.id,
      "Payment Successful",
      `Your payment of ${amount} has been processed successfully. Reference: ${referenceNumber}`,
      "success"
    );

    return NextResponse.json({
      message: "Payment successful",
      referenceNumber
    });
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: error.message || "Payment failed" },
      { status: 400 }
    );
  }
} 