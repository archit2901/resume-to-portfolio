"use client";

import type { Education } from "../../lib/types";
import SectionCard from "./SectionCard";

const INPUT =
  "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const LABEL = "block text-xs font-medium text-zinc-400 mb-1.5";

interface Props {
  education: Education[];
  onChange: (education: Education[]) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5" />
  </svg>
);

function EducationEntry({
  edu,
  index,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  index: number;
  onUpdate: (index: number, edu: Education) => void;
  onRemove: (index: number) => void;
}) {
  const update = (field: keyof Education, value: string) => {
    onUpdate(index, { ...edu, [field]: value });
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
          <div className="sm:col-span-2">
            <label className={LABEL}>Institution</label>
            <input className={INPUT} placeholder="University of..." value={edu.institution} onChange={(e) => update("institution", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL}>Degree</label>
            <input className={INPUT} placeholder="B.S. in Computer Science" value={edu.degree} onChange={(e) => update("degree", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Duration</label>
            <input className={INPUT} placeholder="2018 - 2022" value={edu.duration} onChange={(e) => update("duration", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>GPA</label>
            <input className={INPUT} placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => update("gpa", e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EducationSection({ education, onChange }: Props) {
  const updateEntry = (index: number, edu: Education) => {
    onChange(education.map((e, i) => (i === index ? edu : e)));
  };

  const removeEntry = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const addEntry = () => {
    onChange([
      ...education,
      { institution: "", degree: "", duration: "", gpa: "" },
    ]);
  };

  return (
    <SectionCard title="Education" icon={ICON} defaultOpen={false} count={education.length} onAdd={addEntry} addLabel="Add">
      <div className="space-y-3">
        {education.map((edu, i) => (
          <EducationEntry
            key={i}
            edu={edu}
            index={i}
            onUpdate={updateEntry}
            onRemove={removeEntry}
          />
        ))}
        {education.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-4">No education entries yet.</p>
        )}
      </div>
    </SectionCard>
  );
}
