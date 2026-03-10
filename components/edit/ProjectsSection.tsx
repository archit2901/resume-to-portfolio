"use client";

import { useState } from "react";
import type { Project } from "../../lib/types";
import SectionCard from "./SectionCard";

const INPUT =
  "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const LABEL = "block text-xs font-medium text-zinc-400 mb-1.5";

interface Props {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
  </svg>
);

function ProjectEntry({
  project,
  index,
  onUpdate,
  onRemove,
}: {
  project: Project;
  index: number;
  onUpdate: (index: number, p: Project) => void;
  onRemove: (index: number) => void;
}) {
  const [newTech, setNewTech] = useState("");

  const update = (field: keyof Project, value: string | string[]) => {
    onUpdate(index, { ...project, [field]: value });
  };

  const addTech = () => {
    const trimmed = newTech.trim();
    if (!trimmed) return;
    update("techStack", [...project.techStack, trimmed]);
    setNewTech("");
  };

  const removeTech = (ti: number) => {
    update("techStack", project.techStack.filter((_, i) => i !== ti));
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-800/20 pl-4 sm:pl-5">
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-indigo-500/40" />

      <div className="py-4 pr-4 sm:pr-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">#{index + 1}</span>
          <button
            onClick={() => onRemove(index)}
            className="rounded-md px-2 py-0.5 text-[11px] text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            Remove
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Project Name</label>
            <input className={INPUT} placeholder="My Project" value={project.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Link</label>
            <input className={INPUT} placeholder="https://..." value={project.link} onChange={(e) => update("link", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Description</label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-y"
              placeholder="What does this project do?"
              value={project.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className={LABEL}>Tech Stack</label>
          <div className="flex flex-wrap items-center gap-1.5">
            {project.techStack.filter((t) => t).map((tech, ti) => (
              <span
                key={ti}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-xs text-zinc-300"
              >
                {tech}
                <button
                  onClick={() => removeTech(ti)}
                  className="text-zinc-600 transition-colors hover:text-red-400"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              className="w-24 rounded-md border border-dashed border-zinc-700 bg-transparent px-2.5 py-1 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:w-36 focus:border-indigo-500 focus:bg-zinc-800/30"
              placeholder="Add..."
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection({ projects, onChange }: Props) {
  const updateEntry = (index: number, p: Project) => {
    onChange(projects.map((proj, i) => (i === index ? p : proj)));
  };

  const removeEntry = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const addEntry = () => {
    onChange([
      ...projects,
      { name: "", description: "", techStack: [], link: "" },
    ]);
  };

  return (
    <SectionCard title="Projects" icon={ICON} defaultOpen={false} count={projects.length} onAdd={addEntry} addLabel="Add">
      <div className="space-y-3">
        {projects.map((p, i) => (
          <ProjectEntry
            key={i}
            project={p}
            index={i}
            onUpdate={updateEntry}
            onRemove={removeEntry}
          />
        ))}
        {projects.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-4">No projects yet.</p>
        )}
      </div>
    </SectionCard>
  );
}
