import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";
import { db } from '@/lib/db';

interface UserRow extends RowDataPacket {
  id: string;
}

interface TransactionRow extends RowDataPacket {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  type: string;
  status: string;
  created_at: Date;
  description: string;
  reference_number: string;
  from_account_number?: string;
  to_account_number?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const transactions = await db.transaction.findMany({
      where: {
        OR: [
          { from_account: { user_id: userId } },
          { to_account: { user_id: userId } }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit ? parseInt(limit) : undefined,
      include: {
        category: true,
        from_account: true,
        to_account: true
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
} 