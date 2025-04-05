import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: string;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  nextLabel?: string;
  prevLabel?: string;
  submitLabel?: string;
  submitingLabel?: string;
  status?: "draft" | "published";
}

export function StepNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onNext,
  onPrev,
  onSubmit,
  nextLabel = "Next",
  prevLabel = "Back",
  submitLabel = "Save",
  submitingLabel = "Saving...",
  status = "draft",
}: StepNavigationProps) {
  if (isFirstStep) {
    return (
      <div className="flex justify-end">
        <Button onClick={onNext}>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isLastStep) {
    return (
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {prevLabel}
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitingLabel}
            </>
          ) : (
            <>{status === "published" ? "Publish" : submitLabel}</>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onPrev}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {prevLabel}
      </Button>
      <Button onClick={onNext}>
        {nextLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
