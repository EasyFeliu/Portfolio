import { NextResponse } from "next/server";

import { listProjects } from "@/lib/projects";
import type { ApiErrorResponse, ProjectsResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = listProjects();
    return NextResponse.json<ProjectsResponse>({
      ok: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("[api/projects] no se pudieron leer los proyectos", error);
    return NextResponse.json<ApiErrorResponse>(
      {
        ok: false,
        error: "DATABASE_ERROR",
        message: "No se pudieron cargar los proyectos.",
      },
      { status: 500 },
    );
  }
}
