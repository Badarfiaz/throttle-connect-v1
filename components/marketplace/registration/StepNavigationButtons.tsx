import { Button } from "@/components/ui/button";

type StepNavigationButtonsProps = {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  submitting?: boolean;
};

export default function StepNavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  submitting = false,
}: StepNavigationButtonsProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-end mt-6 gap-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || submitting}
      >
        Previous
      </Button>

      <Button onClick={onNext} disabled={submitting}>
        {isLastStep ? "Submit" : "Next"}
      </Button>
    </div>
  );
}
