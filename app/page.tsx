"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UploadZone from "../components/UploadZone";
import LoadingSteps from "../components/LoadingSteps";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const generateRes = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });

        const generateJson = await generateRes.json();

        if (!generateRes.ok) {
          throw new Error(generateJson.error || "Failed to process resume.");
        }

        const templateRes = await fetch("/api/template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: generateJson.data }),
        });

        const templateJson = await templateRes.json();

        if (!templateRes.ok) {
          throw new Error(templateJson.error || "Failed to generate portfolio.");
        }

        sessionStorage.setItem("portfolioHtml", templateJson.html);
        sessionStorage.setItem(
          "resumeData",
          JSON.stringify(generateJson.data)
        );
        router.push("/preview");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
        setIsLoading(false);
        setFileName(null);
      }
    },
    [router]
  );

  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      ),
      title: "Instant",
      desc: "Portfolio ready in under 30 seconds",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
      ),
      title: "Beautiful",
      desc: "Dark & light mode, animations, responsive",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      ),
      title: "Downloadable",
      desc: "Single HTML file, host anywhere",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center"
        >
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              AI-Powered
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Resume to{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Upload your resume and get a stunning portfolio website in seconds.
            </p>
          </div>

          {isLoading ? (
            <div>
              {fileName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 inline-flex items-center gap-2 rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {fileName}
                </motion.div>
              )}
              <LoadingSteps isLoading={isLoading} />
            </div>
          ) : (
            <UploadZone onFileSelect={handleFileSelect} disabled={isLoading} />
          )}

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4"
            >
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => { setError(null); setFileName(null); }}
                className="mt-2 text-xs font-medium text-red-400/70 underline underline-offset-2 hover:text-red-300"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-5">
                <div className="text-indigo-400">{f.icon}</div>
                <span className="text-sm font-semibold text-zinc-200">{f.title}</span>
                <span className="text-xs text-zinc-500 leading-snug">{f.desc}</span>
              </div>
            ))}
          </motion.div>

          <p className="mt-10 text-xs text-zinc-600">
            Your resume is processed securely and never stored. Open source on GitHub.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
