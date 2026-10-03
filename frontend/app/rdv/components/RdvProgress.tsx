// app/rdv/components/RdvProgress.tsx
interface RdvProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function RdvProgress({
  currentStep,
  totalSteps,
}: RdvProgressProps) {
  const steps = ["Nature du litige", "Coordonnées", "Confirmation"];

  return (
    <div className="mb-8">
      <div className="relative flex justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                    isActive
                      ? "border-olive bg-olive text-white"
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-line bg-white text-ink-soft dark:bg-navy-deep"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-1/2 h-1 w-full -translate-y-1/2 ${
                      isCompleted
                        ? "bg-green-500"
                        : "bg-line dark:bg-navy-deep"
                    }`}
                  ></div>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  isActive
                    ? "text-olive"
                    : isCompleted
                    ? "text-green-500"
                    : "text-ink-soft"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}