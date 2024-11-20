import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.walletAddress, params.walletAddress),
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account' },
      { status: 500 }
    );
  }
}