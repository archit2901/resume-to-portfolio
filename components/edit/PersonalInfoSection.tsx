"use client";

import type { ResumeData } from "../../lib/types";
import SectionCard from "./SectionCard";

const INPUT =
  "w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors";
const LABEL = "block text-xs font-medium text-zinc-400 mb-1.5";

interface Props {
  data: ResumeData;
  onChange: (field: keyof ResumeData, value: string) => void;
}

const ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default function PersonalInfoSection({ data, onChange }: Props) {
  return (
    <SectionCard title="Personal Information" icon={ICON} defaultOpen>
      <div className="space-y-5">
        {/* Identity */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Full Name *</label>
            <input className={INPUT} placeholder="John Doe" value={data.name} onChange={(e) => onChange("name", e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>Professional Title</label>
            <input className={INPUT} placeholder="Software Engineer" value={data.title} onChange={(e) => onChange("title", e.target.value)} />
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Contact</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className={LABEL}>Email</label>
              <input className={INPUT} type="email" placeholder="john@example.com" value={data.email} onChange={(e) => onChange("email", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input className={INPUT} placeholder="+1 234 567 8900" value={data.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Location</label>
              <input className={INPUT} placeholder="San Francisco, CA" value={data.location} onChange={(e) => onChange("location", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Links</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className={LABEL}>LinkedIn</label>
              <input className={INPUT} placeholder="linkedin.com/in/..." value={data.linkedin} onChange={(e) => onChange("linkedin", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>GitHub</label>
              <input className={INPUT} placeholder="github.com/..." value={data.github} onChange={(e) => onChange("github", e.target.value)} />
            </div>
            <div>
              <label className={LABEL}>Portfolio</label>
              <input className={INPUT} placeholder="yoursite.com" value={data.portfolio} onChange={(e) => onChange("portfolio", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
