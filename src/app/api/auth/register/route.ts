import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { generateAccountNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      phone,
      date_of_birth,
      gender,
      marital_status,
      street,
      city,
      state,
      postal_code,
      country,
    } = await req.json();

    // Check username availability
    let isUsernameTaken = true;
    let attempts = 0;
    let finalUsername = username;

    while (isUsernameTaken && attempts < 5) {
      const existingUsername = await query({
        sql: "SELECT id FROM users WHERE username = ?",
        values: [finalUsername],
      });

      if (!existingUsername.length) {
        isUsernameTaken = false;
      } else {
        attempts++;
        finalUsername = `${username}${attempts}`;
      }
    }

    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "Could not generate unique username" },
        { status: 400 }
      );
    }

    // Check if email exists
    const existingUser = await query({
      sql: "SELECT id FROM users WHERE email = ?",
      values: [email],
    });

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate IDs
    const userId = uuidv4();
    const addressId = uuidv4();
    const accountId = uuidv4();
    const accountNumber = generateAccountNumber();

    try {
      // Start transaction
      await query({ sql: "START TRANSACTION" });

      // Insert user
      await query({
        sql: `
          INSERT INTO users (
            id, first_name, last_name, username, email, password, 
            phone, date_of_birth, gender, marital_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          userId,
          first_name,
          last_name,
          finalUsername,
          email,
          hashedPassword,
          phone,
          date_of_birth,
          gender,
          marital_status,
        ],
      });

      // Insert address
      await query({
        sql: `
          INSERT INTO addresses (
            id, user_id, street, city, state, postal_code, country
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          addressId,
          userId,
          street,
          city,
          state,
          postal_code,
          country,
        ],
      });

      // Insert account
      await query({
        sql: `
          INSERT INTO accounts (
            id, user_id, account_number, account_type, balance, status, currency
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          accountId,
          userId,
          accountNumber,
          'savings',
          0,
          'active',
          'USD',
        ],
      });

      // Commit transaction
      await query({ sql: "COMMIT" });

      return NextResponse.json({ 
        message: "Registration successful",
        username: finalUsername,
      });
    } catch (error) {
      // Rollback on error
      await query({ sql: "ROLLBACK" });
      throw error;
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
} 