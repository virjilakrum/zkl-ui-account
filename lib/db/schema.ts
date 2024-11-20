{`import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  walletAddress: varchar('wallet_address', { length: 44 }).unique().notNull(),
  accountId: varchar('account_id', { length: 10 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  ipfsHash: varchar('ipfs_hash', { length: 64 }).notNull(),
  transactionSignature: varchar('transaction_signature', { length: 88 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type File = typeof files.$inferSelect;`}