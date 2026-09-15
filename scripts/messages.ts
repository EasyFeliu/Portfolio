/**
 * Lista los mensajes de contacto guardados en SQLite.
 *
 *   npm run db:messages
 */
import { listContactMessages } from "@/lib/messages";

function main(): void {
  const messages = listContactMessages(100);

  if (messages.length === 0) {
    console.log("No hay mensajes guardados todavía.");
    return;
  }

  console.log(`${messages.length} mensaje(s):\n`);
  for (const item of messages) {
    console.log(`#${item.id} · ${item.createdAt}`);
    console.log(`${item.name} <${item.email}>`);
    console.log(`${item.message}\n`);
  }
}

main();
