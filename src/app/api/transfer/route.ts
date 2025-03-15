import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from 'uuid';
import { generateReferenceNumber } from "@/lib/utils";

interface UserRow extends RowDataPacket {
  id: string;
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getAuthUser(req) as UserRow;
    if (!currentUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.json();
    const { from_account_id, to_user_id, amount, description } = body;

    if (!from_account_id || !to_user_id || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify account ownership
    const accountCheck = await query({
      query: "SELECT * FROM accounts WHERE id = ? AND user_id = ?",
      values: [from_account_id, currentUser.id],
    }) as RowDataPacket[];

    if (accountCheck.length === 0) {
      return new Response(
        JSON.stringify({ error: "Account not found or unauthorized" }), 
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get recipient's default account
    const recipientAccount = await query({
      query: "SELECT * FROM accounts WHERE user_id = ? LIMIT 1",
      values: [to_user_id],
    }) as RowDataPacket[];

    if (recipientAccount.length === 0) {
      return new Response(
        JSON.stringify({ error: "Recipient account not found" }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Start transaction
    await query({ query: "START TRANSACTION" });

    try {
      const transactionId = uuidv4();
      const referenceNumber = generateReferenceNumber();

      // Deduct from sender
      await query({
        query: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        values: [amount, from_account_id],
      });

      // Add to recipient
      await query({
        query: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        values: [amount, recipientAccount[0].id],
      });

      // Record transaction with ID and reference number
      await query({
        query: `
          INSERT INTO transactions 
          (id, from_account_id, to_account_id, amount, type, description, status, reference_number, created_at) 
          VALUES (?, ?, ?, ?, 'transfer', ?, 'completed', ?, NOW())
        `,
        values: [
          transactionId,
          from_account_id, 
          recipientAccount[0].id, 
          amount, 
          description || 'Transfer',
          referenceNumber
        ],
      });

      await query({ query: "COMMIT" });

      return new Response(
        JSON.stringify({ 
          message: "Transfer successful",
          transaction_id: transactionId,
          reference_number: referenceNumber
        }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      await query({ query: "ROLLBACK" });
      throw error;
    }

  } catch (error) {
    console.error("Transfer error:", error);
    return new Response(
      JSON.stringify({ error: "Transfer failed" }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 