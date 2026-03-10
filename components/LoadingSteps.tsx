"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Uploading your resume...", duration: 1500 },
  { label: "Reading the content...", duration: 2000 },
  { label: "Extracting your details with AI...", duration: 4000 },
  { label: "Preparing data for review...", duration: 2000 },
];

interface LoadingStepsProps {
  isLoading: boolean;
  lastStepLabel?: string;
}

export default function LoadingSteps({ isLoading, lastStepLabel }: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = lastStepLabel
    ? STEPS.map((s, i) => (i === STEPS.length - 1 ? { ...s, label: lastStepLabel } : s))
    : STEPS;

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      return;
    }

    let stepIndex = 0;
    const advance = () => {
      if (stepIndex < STEPS.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setTimeout(advance, STEPS[stepIndex].duration);
      }
    };

    const timeout = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="flex flex-col items-center gap-6 py-12"
    >
      {/* Animated spinner */}
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-zinc-700" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
      </div>

      {/* Step text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-base font-medium text-zinc-300"
        >
          {steps[currentStep].label}
        </motion.p>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
              i <= currentStep ? "bg-indigo-500" : "bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
