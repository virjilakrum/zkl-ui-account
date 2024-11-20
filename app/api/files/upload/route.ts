import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { files, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const uploadSchema = z.object({
  senderId: z.string().uuid(),
  recipientId: z.string().length(10),
  ipfsHash: z.string(),
  transactionSignature: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderId, recipientId, ipfsHash, transactionSignature } = uploadSchema.parse(body);

    // Find recipient by account ID
    const recipient = await db.query.users.findFirst({
      where: eq(users.accountId, recipientId),
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Create file record
    const [file] = await db
      .insert(files)
      .values({
        senderId,
        receiverId: recipient.id,
        ipfsHash,
        transactionSignature,
      })
      .returning();

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}</content>