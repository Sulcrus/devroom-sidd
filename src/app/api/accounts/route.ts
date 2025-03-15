import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { db } from '@/lib/db';

interface UserRow extends RowDataPacket {
  id: string;
}

interface AccountRow extends RowDataPacket {
  id: string;
  user_id: string;
  account_number: string;
  balance: number;
  currency: string;
  status: string;
  created_at: Date;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const accounts = await db.account.findMany({
      where: {
        user_id: userId
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
} 