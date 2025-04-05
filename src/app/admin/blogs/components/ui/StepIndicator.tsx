import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
};

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center relative w-full",
              index === steps.length - 1
                ? ""
                : "after:content-[''] after:absolute after:top-4 after:w-full after:h-0.5 after:bg-muted after:right-0 after:translate-x-1/2",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border text-center z-10",
                currentStep === step.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : steps.findIndex((s) => s.id === currentStep) > index
                    ? "border-primary bg-primary-foreground text-primary"
                    : "border-muted bg-background",
              )}
            >
              {steps.findIndex((s) => s.id === currentStep) > index ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className="mt-2 text-xs font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
