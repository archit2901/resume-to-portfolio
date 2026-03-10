"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioPreview from "../../components/PortfolioPreview";
import type { Viewport } from "../../components/PortfolioPreview";
import ActionBar from "../../components/ActionBar";

const VIEWPORTS: { key: Viewport; label: string; icon: JSX.Element }[] = [
  {
    key: "desktop",
    label: "Desktop",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    ),
  },
  {
    key: "tablet",
    label: "Tablet",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
    ),
  },
  {
    key: "mobile",
    label: "Mobile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
    ),
  },
];

export default function PreviewPage() {
  const router = useRouter();
  const [html, setHtml] = useState<string | null>(null);
  const [name, setName] = useState("portfolio");
  const [viewport, setViewport] = useState<Viewport>("desktop");

  useEffect(() => {
    const storedHtml = sessionStorage.getItem("portfolioHtml");
    const storedData = sessionStorage.getItem("resumeData");

    if (!storedHtml) {
      router.push("/");
      return;
    }

    setHtml(storedHtml);

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.name) {
          setName(
            data.name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .slice(0, 50)
          );
        }
      } catch {
        // ignore parse error
      }
    }
  }, [router]);

  const handleDownload = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [html, name]);

  const handleOpenNewTab = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [html]);

  const handleNewUpload = useCallback(() => {
    sessionStorage.removeItem("portfolioHtml");
    sessionStorage.removeItem("resumeData");
    router.push("/");
  }, [router]);

  if (!html) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-4 pb-24"
        >
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-medium text-zinc-400">
                Portfolio Preview
              </h1>
              <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                Ready
              </span>
            </div>

            {/* Viewport toggles */}
            <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
              {VIEWPORTS.map((v) => (
                <button
                  key={v.key}
                  onClick={() => setViewport(v.key)}
                  title={v.label}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    viewport === v.key
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {v.icon}
                  <span className="hidden sm:inline">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <PortfolioPreview html={html} viewport={viewport} />
        </motion.div>
      </AnimatePresence>

      <ActionBar onDownload={handleDownload} onNewUpload={handleNewUpload} onOpenNewTab={handleOpenNewTab} />
    </div>
  );
}
