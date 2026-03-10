"use client";

import type { CustomSection, CustomSectionItem } from "../../lib/types";
import SectionCard from "./SectionCard";

const INPUT =
  "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const LABEL = "block text-xs font-medium text-zinc-400 mb-1.5";

interface Props {
  customSections: CustomSection[];
  onChange: (sections: CustomSection[]) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" />
  </svg>
);

function CustomSectionEditor({
  section,
  index,
  onUpdate,
  onRemove,
}: {
  section: CustomSection;
  index: number;
  onUpdate: (index: number, s: CustomSection) => void;
  onRemove: (index: number) => void;
}) {
  const updateTitle = (title: string) => {
    onUpdate(index, { ...section, title });
  };

  const updateItem = (ii: number, item: CustomSectionItem) => {
    onUpdate(index, {
      ...section,
      items: section.items.map((it, i) => (i === ii ? item : it)),
    });
  };

  const removeItem = (ii: number) => {
    onUpdate(index, {
      ...section,
      items: section.items.filter((_, i) => i !== ii),
    });
  };

  const addItem = () => {
    onUpdate(index, {
      ...section,
      items: [...section.items, { text: "" }],
    });
  };

  return (
    <div className="relative rounded-xl border border-zinc-800 bg-zinc-800/20 pl-4 sm:pl-5">
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-indigo-500/40" />

      <div className="py-4 pr-4 sm:pr-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1">
            <label className={LABEL}>Section Title</label>
            <input
              className={INPUT}
              placeholder="e.g. Certifications, Languages, Volunteer Work"
              value={section.title}
              onChange={(e) => updateTitle(e.target.value)}
            />
          </div>
          <button
            onClick={() => onRemove(index)}
            className="mt-5 rounded-md px-2 py-0.5 text-[11px] text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            Remove
          </button>
        </div>

        <div className="space-y-2">
          {section.items.map((item, ii) => (
            <div key={ii} className="group flex items-start gap-2">
              <div className="flex-1 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                <input
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Item text"
                  value={item.text}
                  onChange={(e) => updateItem(ii, { ...item, text: e.target.value })}
                />
                <input
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 placeholder-zinc-600 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Description (optional)"
                  value={item.description || ""}
                  onChange={(e) => updateItem(ii, { ...item, description: e.target.value || undefined })}
                />
              </div>
              <button
                onClick={() => removeItem(ii)}
                className="mt-2 rounded px-1 text-xs text-zinc-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-3 w-full rounded-lg border border-dashed border-zinc-700 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}

export default function CustomSectionsSection({
  customSections,
  onChange,
}: Props) {
  const updateSection = (index: number, s: CustomSection) => {
    onChange(customSections.map((sec, i) => (i === index ? s : sec)));
  };

  const removeSection = (index: number) => {
    onChange(customSections.filter((_, i) => i !== index));
  };

  const addSection = () => {
    onChange([...customSections, { title: "", items: [{ text: "" }] }]);
  };

  return (
    <SectionCard
      title="Additional Sections"
      icon={ICON}
      defaultOpen={customSections.length > 0}
      count={customSections.length}
      onAdd={addSection}
      addLabel="Add Section"
    >
      <div className="space-y-3">
        {customSections.map((section, i) => (
          <CustomSectionEditor
            key={i}
            section={section}
            index={i}
            onUpdate={updateSection}
            onRemove={removeSection}
          />
        ))}
        {customSections.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-4">
            No additional sections. Add certifications, awards, languages, etc.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
