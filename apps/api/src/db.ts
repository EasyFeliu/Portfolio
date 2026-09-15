import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { env } from "./env";
import { seedProjects } from "./seed-projects";

type GlobalWithDb = typeof globalThis & {
  __portfolioDb?: Database.Database;
};

const globalWithDb = globalThis as GlobalWithDb;

function resolveDatabasePath(): string {
  return path.isAbsolute(env.databasePath)
    ? env.databasePath
    : path.join(process.cwd(), env.databasePath);
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      year INTEGER NOT NULL,
      repo_url TEXT,
      demo_url TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
      ON contact_messages (created_at DESC);
  `);
}

/**
 * Inserta (o actualiza) los proyectos de `src/seed-projects.ts`.
 * Es idempotente: se puede ejecutar tantas veces como se quiera.
 */
export function seedDatabase(db: Database.Database = getDb()): number {
  const upsert = db.prepare(`
    INSERT INTO projects (slug, title, summary, tags, year, repo_url, demo_url, featured, position)
    VALUES (@slug, @title, @summary, @tags, @year, @repoUrl, @demoUrl, @featured, @position)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      summary = excluded.summary,
      tags = excluded.tags,
      year = excluded.year,
      repo_url = excluded.repo_url,
      demo_url = excluded.demo_url,
      featured = excluded.featured,
      position = excluded.position
  `);

  const run = db.transaction((): number => {
    seedProjects.forEach((project, index) => {
      upsert.run({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        tags: JSON.stringify(project.tags),
        year: project.year,
        repoUrl: project.repoUrl,
        demoUrl: project.demoUrl,
        featured: project.featured ? 1 : 0,
        position: index,
      });
    });
    return seedProjects.length;
  });

  return run();
}

function seedIfEmpty(db: Database.Database): void {
  const row = db.prepare("SELECT COUNT(*) AS total FROM projects").get() as { total: number };
  if (row.total === 0) {
    seedDatabase(db);
  }
}

export function getDb(): Database.Database {
  if (globalWithDb.__portfolioDb) {
    return globalWithDb.__portfolioDb;
  }

  const file = resolveDatabasePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  migrate(db);
  seedIfEmpty(db);

  globalWithDb.__portfolioDb = db;
  return db;
}

export function closeDb(): void {
  globalWithDb.__portfolioDb?.close();
  globalWithDb.__portfolioDb = undefined;
}
