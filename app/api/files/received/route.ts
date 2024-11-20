import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { files, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const receivedFiles = await db.query.files.findMany({
      where: eq(files.receiverId, params.userId),
      with: {
        sender: true,
      },
      orderBy: (files, { desc }) => [desc(files.createdAt)],
    });

    return NextResponse.json(receivedFiles);
  } catch (error) {
    console.error('Error fetching received files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch received files' },
      { status: 500 }
    );
  }
} </content>