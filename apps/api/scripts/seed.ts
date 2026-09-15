/**
 * Semilla de la base de datos.
 *
 *   npm run db:seed            -> inserta o actualiza los proyectos
 *   npm run db:seed -- --reset -> borra los proyectos antes de insertarlos
 */
import { getDb, seedDatabase } from "../src/db";
import { countContactMessages } from "../src/messages";
import { countProjects } from "../src/projects";

function main(): void {
  const reset = process.argv.includes("--reset");
  const db = getDb();

  if (reset) {
    db.exec("DELETE FROM projects");
    console.log("· Tabla `projects` vaciada (--reset).");
  }

  const total = seedDatabase(db);

  console.log(`✓ ${total} proyectos sincronizados.`);
  console.log(`· Proyectos en base de datos: ${countProjects()}`);
  console.log(`· Mensajes de contacto guardados: ${countContactMessages()}`);
}

main();
