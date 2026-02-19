"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  name: string;
  key: number;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function OnboardingStepper({
  steps,
  currentStep,
}: StepperProps) {
  return (
    <div className="w-full flex items-center justify-between relative mb-8">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10 transform -translate-y-1/2 rounded-full" />

      {/* Progress Line */}
      <motion.div
        className="absolute top-1/2 left-0 h-1 bg-primary -z-10 transform -translate-y-1/2 rounded-full"
        initial={{ width: "0%" }}
        animate={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.key} className="flex flex-col items-center relative">
            <motion.div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                isCompleted || isCurrent
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-gray-300 text-gray-400 dark:border-gray-700"
              }`}
              initial={false}
              animate={{
                scale: isCurrent ? 1.2 : 1,
              }}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </motion.div>
            <span
              className={`absolute top-12 text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                isCurrent ? "text-primary" : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
