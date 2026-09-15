import { NextResponse } from "next/server";

import { countContactMessages } from "@/lib/messages";
import { countProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = countProjects();
    const messages = countContactMessages();

    return NextResponse.json({
      ok: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database: { ok: true, projects, messages },
    });
  } catch (error) {
    console.error("[api/health] error de base de datos", error);
    return NextResponse.json(
      {
        ok: false,
        status: "error",
        timestamp: new Date().toISOString(),
        database: { ok: false },
        message: "No se pudo consultar la base de datos.",
      },
      { status: 503 },
    );
  }
}
