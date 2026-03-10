"use client";

import { useState } from "react";
import type { SkillCategory } from "../../lib/types";
import SectionCard from "./SectionCard";

interface Props {
  skills: SkillCategory[];
  onChange: (skills: SkillCategory[]) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
  </svg>
);

function SkillCategoryEditor({
  category,
  index,
  onUpdate,
  onRemove,
}: {
  category: SkillCategory;
  index: number;
  onUpdate: (index: number, cat: SkillCategory) => void;
  onRemove: (index: number) => void;
}) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    onUpdate(index, { ...category, items: [...category.items, trimmed] });
    setNewSkill("");
  };

  const removeSkill = (skillIndex: number) => {
    onUpdate(index, {
      ...category,
      items: category.items.filter((_, i) => i !== skillIndex),
    });
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-800/20 p-4">
      <div className="mb-3 flex items-center gap-3">
        <input
          className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-700 focus:bg-zinc-800/50"
          placeholder="Category name"
          value={category.category}
          onChange={(e) =>
            onUpdate(index, { ...category, category: e.target.value })
          }
        />
        <button
          onClick={() => onRemove(index)}
          className="rounded-md px-2 py-0.5 text-[11px] text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          Remove
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {category.items
          .filter((s) => s)
          .map((skill, si) => (
            <span
              key={si}
              className="group inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-xs text-zinc-300"
            >
              {skill}
              <button
                onClick={() => removeSkill(si)}
                className="text-zinc-600 transition-colors hover:text-red-400"
              >
                &times;
              </button>
            </span>
          ))}
        <div className="inline-flex items-center">
          <input
            className="w-24 rounded-md border border-dashed border-zinc-700 bg-transparent px-2.5 py-1 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:w-36 focus:border-indigo-500 focus:bg-zinc-800/30"
            placeholder="Add..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          />
        </div>
      </div>
    </div>
  );
}

export default function SkillsSection({ skills, onChange }: Props) {
  const updateCategory = (index: number, cat: SkillCategory) => {
    onChange(skills.map((s, i) => (i === index ? cat : s)));
  };

  const removeCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    onChange([...skills, { category: "", items: [] }]);
  };

  return (
    <SectionCard title="Skills" icon={ICON} defaultOpen count={skills.length} onAdd={addCategory} addLabel="Add Category">
      <div className="space-y-3">
        {skills.map((cat, i) => (
          <SkillCategoryEditor
            key={i}
            category={cat}
            index={i}
            onUpdate={updateCategory}
            onRemove={removeCategory}
          />
        ))}
        {skills.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-4">No skill categories yet.</p>
        )}
      </div>
    </SectionCard>
  );
}
