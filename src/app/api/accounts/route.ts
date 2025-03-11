import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { generateAccountNumber } from "@/lib/accountNumberGenerator";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await query({
      sql: `
        SELECT * FROM accounts 
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

    const accountId = uuidv4();
    const accountNumber = generateAccountNumber();

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

    return NextResponse.json({
      message: "Account created successfully",
      accountNumber,
    });
  } catch (error: any) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
} 