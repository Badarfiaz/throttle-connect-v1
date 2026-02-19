import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
type StepNavigationButtonsProps = {
  currentStep: number;
  steps: {
    key: number;
    name: string;
    description: string;
  }[];
  onPrevious: () => void;
  onNext: () => void;
  submitting: boolean;
};

function StepNavigationButtons({
  currentStep,
  steps,
  onPrevious,
  onNext,
  submitting,
}: StepNavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={currentStep === 0 || submitting}
        className={`text-muted-foreground hover:text-foreground transition-all pl-0 hover:bg-transparent ${currentStep === 0 ? "invisible" : ""}`}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Button
        onClick={onNext}
        disabled={submitting}
        className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full transition-all hover:scale-105 active:scale-95"
      >
        {submitting ? (
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>
              {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
            </span>
            {currentStep !== steps.length - 1 && (
              <ArrowRight className="w-4 h-4" />
            )}
          </div>
        )}
      </Button>
    </div>
  );
}

export default StepNavigationButtons;
