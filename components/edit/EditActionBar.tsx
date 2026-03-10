"use client";

import { motion } from "framer-motion";

interface EditActionBarProps {
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function EditActionBar({
  onBack,
  onGenerate,
  isGenerating,
}: EditActionBarProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="h-6 w-px bg-zinc-700" />

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
            </svg>
          )}
          {isGenerating ? "Generating..." : "Generate Portfolio"}
        </button>
      </div>
    </motion.div>
  );
}
