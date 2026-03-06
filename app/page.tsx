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

  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Upload and extract data with Gemini
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

        // Step 2: Generate HTML from extracted data
        const templateRes = await fetch("/api/template", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: generateJson.data }),
        });

        const templateJson = await templateRes.json();

        if (!templateRes.ok) {
          throw new Error(templateJson.error || "Failed to generate portfolio.");
        }

        // Store in sessionStorage and navigate to preview
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
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Subtle gradient background */}
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
          {/* Header */}
          <div className="mb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
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
              <br />
              Powered by AI. No sign-up required.
            </p>
          </div>

          {/* Upload or Loading */}
          {isLoading ? (
            <LoadingSteps isLoading={isLoading} />
          ) : (
            <UploadZone onFileSelect={handleFileSelect} disabled={isLoading} />
          )}

          {/* Error display */}
          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Footer note */}
          <p className="mt-12 text-xs text-zinc-600">
            Your resume is processed securely and never stored.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
