"use client";

import { cn } from "@/lib/utils";

type StepperProps = {
  steps: { id: number; title: string }[];
  currentStep: number;
};

export default function Stepper({
  steps,
  currentStep,
}: StepperProps) {
  return (
    <div className="flex justify-center items-center gap-6 mb-10">
      {steps.map((step, index) => {
        const active = step.id === currentStep;
        const done = step.id < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <span
              className={cn(
                "w-3 h-3 rounded-full",
                active || done
                  ? "bg-primary"
                  : "bg-muted-foreground/40"
              )}
            />

            <span
              className={cn(
                "text-sm font-medium",
                active
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>

            {index !== steps.length - 1 && (
              <span className="w-24 h-[2px] bg-muted-foreground/30" />
            )}
          </div>
        );
      })}
    </div>
  );
}
