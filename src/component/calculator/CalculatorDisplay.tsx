

// src/components/calculator/CalculatorDisplay.tsx

interface CalculatorDisplayProps {
  expression: string;
  value: string;
}

export function CalculatorDisplay({ expression, value }: CalculatorDisplayProps) {
  return (
    <div className="mb-4 rounded-xl border border-violet-300 bg-violet-50/80 px-5 py-6 text-right dark:border-violet-500/20 dark:bg-black/40">
      <div className="h-5 truncate text-sm text-violet-500/70 dark:text-violet-400/70">
        {expression || "\u00A0"}
      </div>
      <div
        className="truncate text-4xl font-semibold text-violet-800 dark:text-violet-200"
        style={{ textShadow: "0 0 18px rgba(124,58,237,0.25)" }}
      >
        {value}
      </div>
    </div>
  );
}