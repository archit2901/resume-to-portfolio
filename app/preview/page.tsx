"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioPreview from "../../components/PortfolioPreview";
import ActionBar from "../../components/ActionBar";

export default function PreviewPage() {
  const router = useRouter();
  const [html, setHtml] = useState<string | null>(null);
  const [name, setName] = useState("portfolio");

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
          setName(data.name.toLowerCase().replace(/\s+/g, "-"));
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
          </div>

          <PortfolioPreview html={html} />
        </motion.div>
      </AnimatePresence>

      <ActionBar onDownload={handleDownload} onNewUpload={handleNewUpload} />
    </div>
  );
}
