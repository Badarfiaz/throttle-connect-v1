import React from "react";
type RegistrationHeaderProps = {
  currentStep: number;
  steps: {
    key: number;
    name: string;
    description: string;
  }[];
};
function RegistrationHeader({ currentStep, steps }: RegistrationHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-1">
        {steps[currentStep].name}
      </h2>
      <p className="text-muted-foreground text-sm">
        {steps[currentStep].description}
      </p>
    </div>
  );
}

export default RegistrationHeader;
