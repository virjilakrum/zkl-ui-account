import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const connectWalletSchema = z.object({
  walletAddress: z.string().length(44),
});

function generateAccountId(): string {
  return Math.random()
    .toString(36)
    .substring(2, 12)
    .toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress } = connectWalletSchema.parse(body);

    // Check if wallet already has an account
    const existingUser = await db.query.users.findFirst({
      where: eq(users.walletAddress, walletAddress),
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Generate unique account ID
    let accountId: string;
    let isUnique = false;

    while (!isUnique) {
      accountId = generateAccountId();
      const existing = await db.query.users.findFirst({
        where: eq(users.accountId, accountId),
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        walletAddress,
        accountId,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}