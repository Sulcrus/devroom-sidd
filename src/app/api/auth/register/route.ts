import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { generateAccountNumber, generateUsername } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      maritalStatus,
      street,
      city,
      state,
      postalCode,
      country,
      accountType = "savings",
    } = await req.json();

    // Generate username and check availability
    let username = generateUsername(firstName, lastName);
    let isUsernameTaken = true;
    let attempts = 0;

    while (isUsernameTaken && attempts < 5) {
      const existingUsername = await query({
        query: "SELECT id FROM users WHERE username = ?",
        values: [username],
      });

      if (!Array.isArray(existingUsername) || existingUsername.length === 0) {
        isUsernameTaken = false;
      } else {
        username = generateUsername(firstName, lastName);
        attempts++;
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
      query: "SELECT id FROM users WHERE email = ?",
      values: [email],
    });

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate IDs
    const userId = uuidv4();
    const addressId = uuidv4();
    const accountId = uuidv4();

    // Start transaction
    await query({
      query: "START TRANSACTION",
    });

    try {
      // Insert user
      await query({
        query: `
          INSERT INTO users (
            id, first_name, last_name, username, email, password, 
            phone, date_of_birth, gender, marital_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          userId,
          firstName,
          lastName,
          username,
          email,
          hashedPassword,
          phone,
          dateOfBirth,
          gender,
          maritalStatus,
        ],
      });

      // Insert address
      await query({
        query: `
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
          postalCode,
          country,
        ],
      });

      // Insert account
      await query({
        query: `
          INSERT INTO accounts (
            id, user_id, account_number, account_type, balance, status, currency
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          accountId,
          userId,
          generateAccountNumber(),
          accountType,
          100.00, // Default initial balance
          'active',
          'USD',
        ],
      });

      // Commit transaction
      await query({
        query: "COMMIT",
      });

      return NextResponse.json({ 
        message: "Registration successful",
        username,
      });
    } catch (error) {
      // Rollback on error
      await query({
        query: "ROLLBACK",
      });
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 