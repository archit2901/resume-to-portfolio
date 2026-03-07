"use client";

import { motion } from "framer-motion";

export type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface PortfolioPreviewProps {
  html: string;
  viewport?: Viewport;
}

export default function PortfolioPreview({ html, viewport = "desktop" }: PortfolioPreviewProps) {
  const width = VIEWPORT_WIDTHS[viewport];
  const isResized = viewport !== "desktop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-zinc-600" />
            <div className="h-3 w-3 rounded-full bg-zinc-600" />
            <div className="h-3 w-3 rounded-full bg-zinc-600" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-zinc-900/60 px-3 py-1 text-xs text-zinc-500">
            your-portfolio.html
          </div>
          {isResized && (
            <span className="text-[10px] text-zinc-600">{width}</span>
          )}
        </div>

        <div className={isResized ? "flex justify-center bg-zinc-950/50 py-4" : ""}>
          <iframe
            srcDoc={html}
            className="bg-white transition-all duration-300"
            style={{
              width,
              maxWidth: "100%",
              height: "calc(100vh - 200px)",
              minHeight: "600px",
            }}
            title="Portfolio Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </motion.div>
  );
}
