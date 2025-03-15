import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/mysql";
import { getAuthUser } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

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

    console.log("Searching for username:", username);

    const users = await query({
      query: `
        SELECT id, username, first_name, last_name 
        FROM users 
        WHERE username = ?
      `,
      values: [username],
    }) as UserRow[];

    console.log("Search results:", users);

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }), 
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (users[0].id === currentUser.id) {
      return new Response(
        JSON.stringify({ error: "Cannot transfer to yourself" }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(users[0]), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Error searching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to search users" }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 