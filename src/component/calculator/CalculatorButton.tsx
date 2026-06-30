// src/components/calculator/CalculatorButton.tsx
import { useClickSound } from "../../hooks/useClickSound";

type ButtonVariant = "number" | "operator" | "function" | "scientific" | "equals";

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  ariaLabel?: string;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  number:
    "bg-violet-700 text-violet-50 border border-violet-800 hover:bg-violet-600 active:bg-violet-800 dark:bg-violet-950/40 dark:text-violet-100 dark:border-violet-500/20 dark:hover:border-violet-400/60 dark:hover:bg-transparent dark:hover:shadow-[0_0_16px_rgba(167,139,250,0.35)] dark:active:bg-violet-900/60",
  operator:
    "bg-violet-800 text-violet-100 border border-violet-900 hover:bg-violet-700 active:bg-violet-900 dark:bg-violet-800/40 dark:text-violet-200 dark:border-violet-500/40 dark:hover:border-violet-300/70 dark:hover:bg-violet-800/40 dark:hover:shadow-[0_0_20px_rgba(167,139,250,0.5)] dark:active:bg-violet-700/60",
  function:
    "bg-violet-600 text-cyan-100 border border-violet-700 hover:bg-violet-500 active:bg-violet-700 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-500/30 dark:hover:border-cyan-400/70 dark:hover:bg-cyan-950/40 dark:hover:shadow-[0_0_16px_rgba(34,211,238,0.35)] dark:active:bg-cyan-900/50",
  scientific:
    "bg-fuchsia-700 text-fuchsia-50 border border-fuchsia-800 hover:bg-fuchsia-600 active:bg-fuchsia-800 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:border-fuchsia-500/30 dark:hover:border-fuchsia-400/70 dark:hover:bg-fuchsia-950/30 dark:hover:shadow-[0_0_16px_rgba(232,121,249,0.4)] dark:active:bg-fuchsia-900/50",
  equals:
    "bg-violet-900 text-white border border-violet-950 shadow-[0_0_16px_rgba(91,33,182,0.4)] hover:bg-violet-800 active:bg-violet-950 dark:bg-violet-500 dark:border-violet-400/50 dark:shadow-[0_0_24px_rgba(168,85,247,0.7)] dark:hover:bg-violet-400 dark:hover:shadow-[0_0_36px_rgba(168,85,247,0.95)] dark:active:bg-violet-600",
};

export function CalculatorButton({
  label,
  onClick,
  variant = "number",
  ariaLabel,
}: CalculatorButtonProps) {
  const playClick = useClickSound();

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={(event) => {
        playClick();
        onClick();
        event.currentTarget.blur();
      }}
      className={`flex h-[72px] items-center justify-center rounded-xl text-2xl font-medium tracking-wide transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${VARIANT_STYLES[variant]}`}
    >
      {label}
    </button>
  );
}