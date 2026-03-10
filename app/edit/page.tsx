"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type {
  ResumeData,
  SkillCategory,
  Experience,
  Education,
  Project,
  CustomSection,
} from "../../lib/types";
import PersonalInfoSection from "../../components/edit/PersonalInfoSection";
import SummarySection from "../../components/edit/SummarySection";
import ExperienceSection from "../../components/edit/ExperienceSection";
import SkillsSection from "../../components/edit/SkillsSection";
import EducationSection from "../../components/edit/EducationSection";
import ProjectsSection from "../../components/edit/ProjectsSection";
import CustomSectionsSection from "../../components/edit/CustomSectionsSection";
import EditActionBar from "../../components/edit/EditActionBar";

export default function EditPage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const customSectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("resumeData");
    if (!stored) {
      router.push("/");
      return;
    }
    try {
      setData(JSON.parse(stored));
    } catch {
      router.push("/");
    }
  }, [router]);

  const updateField = useCallback(
    (field: keyof ResumeData, value: string) => {
      setData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const updateSkills = useCallback((skills: SkillCategory[]) => {
    setData((prev) => (prev ? { ...prev, skills } : prev));
  }, []);

  const updateExperience = useCallback((experience: Experience[]) => {
    setData((prev) => (prev ? { ...prev, experience } : prev));
  }, []);

  const updateEducation = useCallback((education: Education[]) => {
    setData((prev) => (prev ? { ...prev, education } : prev));
  }, []);

  const updateProjects = useCallback((projects: Project[]) => {
    setData((prev) => (prev ? { ...prev, projects } : prev));
  }, []);

  const updateCustomSections = useCallback(
    (customSections: CustomSection[]) => {
      setData((prev) => (prev ? { ...prev, customSections } : prev));
    },
    []
  );

  const addNewSection = useCallback(() => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customSections: [
          ...(prev.customSections || []),
          { title: "", items: [{ text: "" }] },
        ],
      };
    });
    // Scroll to custom sections after state update
    setTimeout(() => {
      customSectionsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!data) return;
    if (!data.name.trim()) {
      setError("Name is required to generate a portfolio.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json.error || "Failed to generate portfolio.");

      sessionStorage.setItem("portfolioHtml", json.html);
      sessionStorage.setItem("resumeData", JSON.stringify(data));
      router.push("/preview");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setIsGenerating(false);
    }
  }, [data, router]);

  const handleBack = useCallback(() => {
    sessionStorage.removeItem("resumeData");
    router.push("/");
  }, [router]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Review &{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Edit
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Review the extracted data and make corrections before generating
            your portfolio.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4"
          >
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-1 text-xs font-medium text-red-400/70 underline underline-offset-2 hover:text-red-300"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PersonalInfoSection data={data} onChange={updateField} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <SummarySection data={data} onChange={updateField} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ExperienceSection
              experience={data.experience}
              onChange={updateExperience}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <SkillsSection skills={data.skills} onChange={updateSkills} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EducationSection
              education={data.education}
              onChange={updateEducation}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <ProjectsSection
              projects={data.projects}
              onChange={updateProjects}
            />
          </motion.div>

          <motion.div
            ref={customSectionsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CustomSectionsSection
              customSections={data.customSections || []}
              onChange={updateCustomSections}
            />
          </motion.div>

          {/* Add New Section — standalone button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <button
              onClick={addNewSection}
              className="group flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 py-5 text-sm font-medium text-zinc-400 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:scale-110"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
              Add New Section
            </button>
          </motion.div>
        </div>
      </div>

      <EditActionBar
        onBack={handleBack}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
}
