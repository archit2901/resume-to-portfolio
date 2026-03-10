"use client";

import { useState } from "react";
import type { Experience } from "../../lib/types";
import SectionCard from "./SectionCard";

const INPUT =
  "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const LABEL = "block text-xs font-medium text-zinc-400 mb-1.5";

interface Props {
  experience: Experience[];
  onChange: (experience: Experience[]) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

function ExperienceEntry({
  exp,
  index,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  index: number;
  onUpdate: (index: number, exp: Experience) => void;
  onRemove: (index: number) => void;
}) {
  const [newBullet, setNewBullet] = useState("");

  const update = (field: keyof Experience, value: string | string[]) => {
    onUpdate(index, { ...exp, [field]: value });
  };

  const addBullet = () => {
    const trimmed = newBullet.trim();
    if (!trimmed) return;
    update("bullets", [...exp.bullets, trimmed]);
    setNewBullet("");
  };

  const removeBullet = (bi: number) => {
    update("bullets", exp.bullets.filter((_, i) => i !== bi));
  };

  const updateBullet = (bi: number, value: string) => {
    update("bullets", exp.bullets.map((b, i) => (i === bi ? value : b)));
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
            <label className={LABEL}>Role / Title</label>
            <input className={INPUT} placeholder="Software Engineer" value={exp.role} onChange={(e) => update("role", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Company</label>
            <input className={INPUT} placeholder="Acme Inc." value={exp.company} onChange={(e) => update("company", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Duration</label>
            <input className={INPUT} placeholder="Jan 2022 - Present" value={exp.duration} onChange={(e) => update("duration", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Location</label>
            <input className={INPUT} placeholder="San Francisco, CA" value={exp.location} onChange={(e) => update("location", e.target.value)} />
          </div>
        </div>

        {/* Bullet points */}
        <div className="mt-4">
          <label className={LABEL}>Key Achievements</label>
          <div className="space-y-1.5">
            {exp.bullets.filter((b) => b !== undefined).map((bullet, bi) => (
              <div key={bi} className="group flex items-center gap-2">
                <span className="text-[10px] text-zinc-600">&bull;</span>
                <input
                  className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-zinc-300 outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-800/50"
                  value={bullet}
                  onChange={(e) => updateBullet(bi, e.target.value)}
                />
                <button
                  onClick={() => removeBullet(bi)}
                  className="rounded px-1 text-xs text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-dashed border-zinc-700 bg-transparent px-3 py-1.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-indigo-500 focus:bg-zinc-800/30"
              placeholder="Add a bullet point..."
              value={newBullet}
              onChange={(e) => setNewBullet(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBullet())}
            />
            <button
              onClick={addBullet}
              className="rounded-lg px-2.5 text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-300"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceSection({ experience, onChange }: Props) {
  const updateEntry = (index: number, exp: Experience) => {
    onChange(experience.map((e, i) => (i === index ? exp : e)));
  };

  const removeEntry = (index: number) => {
    onChange(experience.filter((_, i) => i !== index));
  };

  const addEntry = () => {
    onChange([
      ...experience,
      { company: "", role: "", duration: "", location: "", bullets: [] },
    ]);
  };

  return (
    <SectionCard title="Experience" icon={ICON} defaultOpen count={experience.length} onAdd={addEntry} addLabel="Add">
      <div className="space-y-3">
        {experience.map((exp, i) => (
          <ExperienceEntry
            key={i}
            exp={exp}
            index={i}
            onUpdate={updateEntry}
            onRemove={removeEntry}
          />
        ))}
        {experience.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-4">No experience entries yet.</p>
        )}
      </div>
    </SectionCard>
  );
}
