import React from "react";
type SidebarRegistrationProps = {
  currentStep: number;
  steps: {
    key: number;
    name: string;
    description: string;
  }[];
  title?: string;
  subtitle?: string;
  supportNote?: string;
};

import { Check } from "lucide-react";
function SidebarRegistration({
  currentStep,
  steps,
  title = "Marketplace",
  subtitle = "Setup your store",
  supportNote = "Contact support if you have trouble setting up your store.",
}: SidebarRegistrationProps) {
  return (
    <div className="w-full md:w-1/3 bg-primary/5 p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-linear-to-br from-primary via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="z-10 w-full">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        </div>

        {/* Vertical Stepper for Desktop */}
        <div className="hidden md:flex flex-col gap-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Step Line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-3.75 top-8 w-0.5 h-[calc(100%+24px)] -z-10 transition-colors duration-500 ${isCompleted ? "bg-primary" : "bg-border"}`}
                  />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 shrink-0
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                            : isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground border border-border"
                        }
                      `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>

                <div
                  className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
                >
                  <h3
                    className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}
                  >
                    {step.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Stepper for Mobile */}
        <div className="md:hidden flex justify-between items-center mb-2 px-2 relative w-full">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div
                key={step.key}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${isActive ? "bg-primary text-primary-foreground scale-110 ring-4 ring-background" : isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto hidden md:block z-10">
        <div className="p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Need Help?</p>
          <p>{supportNote}</p>
        </div>
      </div>
    </div>
  );
}

export default SidebarRegistration;
