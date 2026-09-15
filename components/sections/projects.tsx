"use client";

import { useEffect, useState } from "react";

import { AlertIcon, ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Project, ProjectsResponse } from "@/lib/types";

type LoadState = "loading" | "ready" | "error";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Respuesta ${response.status}`);
        }
        const data = (await response.json()) as ProjectsResponse;
        setProjects(data.projects ?? []);
        setState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("No se pudieron cargar los proyectos", error);
        setState("error");
      }
    }

    void loadProjects();
    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setState("loading");
    setAttempt((current) => current + 1);
  };

  return (
    <section id="proyectos" className="scroll-mt-24 bg-subtle/60 py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="Proyectos"
          title="Cosas que he construido."
          description="Una selección de trabajos recientes. Los datos se cargan desde la API del propio sitio (GET /api/projects)."
        />

        <div className="mt-12" aria-live="polite" aria-busy={state === "loading"}>
          {state === "loading" ? <ProjectsSkeleton /> : null}

          {state === "error" ? (
            <div className="card items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-3 text-sm text-muted">
                <AlertIcon className="mt-0.5 size-5 shrink-0 text-[#e5484d]" />
                No se han podido cargar los proyectos. Comprueba que el servidor está activo.
              </p>
              <button type="button" className="btn btn-secondary min-h-10 px-5 text-sm" onClick={retry}>
                Reintentar
              </button>
            </div>
          ) : null}

          {state === "ready" && projects.length === 0 ? (
            <p className="text-sm text-muted">
              Todavía no hay proyectos publicados. Ejecuta <code>npm run db:seed</code> para cargar los
              de ejemplo.
            </p>
          ) : null}

          {state === "ready" && projects.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
              {projects.map((project, index) => (
                <Reveal as="li" key={project.id} delay={index * 80} className="h-full">
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card card-interactive h-full p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[0.8125rem] font-medium text-faint">{project.year}</span>
        {project.featured ? <span className="chip border-none bg-accent-soft text-accent">Destacado</span> : null}
      </div>

      <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">{project.title}</h3>

      <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{project.summary}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="chip">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-5 text-sm">
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-medium text-ink transition-colors hover:text-accent"
          >
            <GithubIcon className="size-4" />
            Código
          </a>
        ) : null}

        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-medium text-accent transition-opacity hover:opacity-75"
          >
            Ver demo
            <ArrowUpRightIcon className="size-4" />
          </a>
        ) : (
          <span className="text-muted">Demo próximamente</span>
        )}
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="card h-52 animate-pulse p-6">
          <span className="sr-only">Cargando proyectos…</span>
          <div className="h-3 w-12 rounded-full bg-hairline" />
          <div className="mt-5 h-5 w-2/3 rounded-full bg-hairline" />
          <div className="mt-4 h-3 w-full rounded-full bg-hairline" />
          <div className="mt-2 h-3 w-5/6 rounded-full bg-hairline" />
          <div className="mt-auto flex gap-2">
            <div className="h-6 w-16 rounded-full bg-hairline" />
            <div className="h-6 w-20 rounded-full bg-hairline" />
          </div>
        </li>
      ))}
    </ul>
  );
}
