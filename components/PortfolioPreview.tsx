"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface PortfolioPreviewProps {
  html: string;
}

export default function PortfolioPreview({ html }: PortfolioPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

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
        </div>

        <iframe
          ref={iframeRef}
          className="w-full bg-white"
          style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
          title="Portfolio Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </motion.div>
  );
}
