import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateAccountNumber } from "@/lib/accountNumberGenerator";

const VALID_ACCOUNT_TYPES = ['savings', 'checking', 'fixed_deposit'];
const VALID_CURRENCIES = ['USD', 'EUR', 'GBP'];

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await query({
      sql: `
        SELECT 
          id, account_number, account_type, balance, 
          currency, status, created_at, updated_at
        FROM accounts 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `,
      values: [user.id],
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountType, currency = 'USD' } = await req.json();

    // Validate input
    if (!accountType) {
      return NextResponse.json(
        { error: "Account type is required" },
        { status: 400 }
      );
    }

    if (!VALID_ACCOUNT_TYPES.includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    if (!VALID_CURRENCIES.includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency" },
        { status: 400 }
      );
    }

    // Check if user already has this type of account
    const existingAccount = await query({
      sql: `
        SELECT id FROM accounts 
        WHERE user_id = ? AND account_type = ? AND status = 'active'
      `,
      values: [user.id, accountType],
    });

    if (existingAccount.length > 0) {
      return NextResponse.json(
        { error: `You already have an active ${accountType} account` },
        { status: 400 }
      );
    }

    const accountId = uuidv4();
    const accountNumber = generateAccountNumber();

    try {
      // Start transaction
      await query({ sql: "START TRANSACTION" });

      // Create account
      await query({
        sql: `
          INSERT INTO accounts (
            id, user_id, account_number, account_type, 
            balance, status, currency
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          accountId,
          user.id,
          accountNumber,
          accountType,
          0,
          'active',
          currency,
        ],
      });

      // Create notification
      await query({
        sql: `
          INSERT INTO notifications (
            id, user_id, title, message, type
          ) VALUES (?, ?, ?, ?, ?)
        `,
        values: [
          uuidv4(),
          user.id,
          'Account Created',
          `Your new ${accountType} account has been created successfully.`,
          'success',
        ],
      });

      // Commit transaction
      await query({ sql: "COMMIT" });

      return NextResponse.json({
        message: "Account created successfully",
        accountNumber,
        accountType,
        currency,
      });
    } catch (error) {
      // Rollback on error
      await query({ sql: "ROLLBACK" });
      throw error;
    }
  } catch (error: any) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
} 