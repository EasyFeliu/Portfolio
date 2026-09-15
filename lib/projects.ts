import { getDb } from "@/lib/db";
import type { Project } from "@/lib/types";

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string;
  year: number;
  repo_url: string | null;
  demo_url: string | null;
  featured: number;
};

function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    tags: parseTags(row.tags),
    year: row.year,
    repoUrl: row.repo_url,
    demoUrl: row.demo_url,
    featured: row.featured === 1,
  };
}

export function listProjects(): Project[] {
  const rows = getDb()
    .prepare(
      `SELECT id, slug, title, summary, tags, year, repo_url, demo_url, featured
       FROM projects
       ORDER BY featured DESC, position ASC, year DESC`,
    )
    .all() as ProjectRow[];

  return rows.map(toProject);
}

export function countProjects(): number {
  const row = getDb().prepare("SELECT COUNT(*) AS total FROM projects").get() as { total: number };
  return row.total;
}
