"use client";

import { useEffect, useState } from "react";

import type { Project } from "@portfolio/shared";

import { AlertIcon, ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { fetchProjects } from "@/lib/api";
import { SECTION_IDS, copy } from "@/lib/content";

type LoadState = "loading" | "ready" | "error";

const SKELETON_CARDS = 4;

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        setProjects(await fetchProjects(controller.signal));
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
    <section id={SECTION_IDS.projects} className="bg-subtle/60 py-20 sm:py-28 lg:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={copy.projects.eyebrow}
          title={copy.projects.title}
          description={copy.projects.description}
        />

        <div className="mt-12" aria-live="polite" aria-busy={state === "loading"}>
          {state === "loading" ? <ProjectsSkeleton /> : null}

          {state === "error" ? (
            <div className="card items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-3 text-sm text-muted">
                <AlertIcon className="mt-0.5 size-5 shrink-0 text-danger" />
                {copy.projects.error}
              </p>
              <button type="button" className="btn btn-secondary min-h-10 px-5 text-sm" onClick={retry}>
                {copy.projects.retry}
              </button>
            </div>
          ) : null}

          {state === "ready" && projects.length === 0 ? (
            <p className="text-sm text-muted">{copy.projects.empty}</p>
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
        {project.featured ? (
          <span className="chip border-none bg-accent-soft text-accent">{copy.projects.featured}</span>
        ) : null}
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
            {copy.projects.codeLink}
            <span className="sr-only">{` — ${project.title} (${copy.openInNewTab})`}</span>
          </a>
        ) : null}

        {project.demoUrl ? (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-medium text-accent transition-opacity hover:opacity-75"
          >
            {copy.projects.demoLink}
            <ArrowUpRightIcon className="size-4" />
            <span className="sr-only">{` — ${project.title} (${copy.openInNewTab})`}</span>
          </a>
        ) : (
          <span className="text-muted">{copy.projects.demoPending}</span>
        )}
      </div>
    </article>
  );
}

function ProjectsSkeleton() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:gap-6">
      {Array.from({ length: SKELETON_CARDS }).map((_, index) => (
        <li key={index} className="card h-52 animate-pulse p-6">
          {index === 0 ? <span className="sr-only">{copy.projects.loading}</span> : null}
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
