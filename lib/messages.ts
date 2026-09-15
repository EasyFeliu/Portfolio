import { getDb } from "@/lib/db";
import type { ContactMessage } from "@/lib/types";

type ContactMessageRow = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export function createContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const result = getDb()
    .prepare(
      `INSERT INTO contact_messages (name, email, message)
       VALUES (@name, @email, @message)`,
    )
    .run(input);

  return {
    id: Number(result.lastInsertRowid),
    ...input,
    createdAt: new Date().toISOString(),
  };
}

export function listContactMessages(limit = 50): ContactMessage[] {
  const rows = getDb()
    .prepare(
      `SELECT id, name, email, message, created_at
       FROM contact_messages
       ORDER BY created_at DESC, id DESC
       LIMIT ?`,
    )
    .all(limit) as ContactMessageRow[];

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    createdAt: row.created_at,
  }));
}

export function countContactMessages(): number {
  const row = getDb().prepare("SELECT COUNT(*) AS total FROM contact_messages").get() as {
    total: number;
  };
  return row.total;
}
