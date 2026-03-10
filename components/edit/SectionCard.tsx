"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  count?: number;
  onAdd?: () => void;
  addLabel?: string;
}

export default function SectionCard({
  title,
  icon,
  defaultOpen = true,
  children,
  count,
  onAdd,
  addLabel = "Add",
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 px-5 py-4 sm:px-6 text-left transition-colors hover:bg-zinc-800/30"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
          {icon}
        </span>
        <h2 className="flex-1 text-sm font-semibold text-zinc-200">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium tabular-nums text-zinc-400">
            {count}
          </span>
        )}
        {onAdd && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
              if (!isOpen) setIsOpen(true);
            }}
            className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-400 transition-colors hover:border-indigo-500/50 hover:text-indigo-300"
          >
            + {addLabel}
          </span>
        )}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="border-t border-zinc-800 px-5 py-5 sm:px-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
