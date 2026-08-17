import { cn } from "@/lib/utils";

const STEPS = [
  "Order Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;

interface StatusTrackerProps {
  currentStep: number;
}

export function StatusTracker({ currentStep }: StatusTrackerProps) {
  const progress = Math.min(
    100,
    Math.max(0, (currentStep / (STEPS.length - 1)) * 100)
  );

  return (
    <div>
      <div className="relative mb-8 hidden md:block">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-outline-variant/40" />
        <div
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-primary transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <ol className="relative z-10 flex justify-between">
          {STEPS.map((step, i) => {
            const active = i <= currentStep;
            const current = i === currentStep;
            return (
              <li key={step} className="flex flex-col items-center gap-3">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center border border-primary bg-background",
                    active && "bg-primary",
                    current && "ring-2 ring-primary ring-offset-4 ring-offset-background"
                  )}
                />
                <span
                  className={cn(
                    "font-label-caps text-on-surface-variant",
                    active && "text-primary"
                  )}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="font-label-caps text-primary md:hidden">
        Current Status: {STEPS[currentStep]}
      </p>
    </div>
  );
}
