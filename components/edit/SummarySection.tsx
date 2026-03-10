"use client";

import type { ResumeData } from "../../lib/types";
import SectionCard from "./SectionCard";

interface Props {
  data: ResumeData;
  onChange: (field: keyof ResumeData, value: string) => void;
}

const ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export default function SummarySection({ data, onChange }: Props) {
  return (
    <SectionCard title="Professional Summary" icon={ICON} defaultOpen>
      <textarea
        rows={4}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors resize-y"
        placeholder="A brief summary of your professional background..."
        value={data.summary}
        onChange={(e) => onChange("summary", e.target.value)}
      />
    </SectionCard>
  );
}
