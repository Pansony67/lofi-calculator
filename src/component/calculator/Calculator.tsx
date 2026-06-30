// src/components/calculator/Calculator.tsx
import { useEffect, useState } from "react";
import { FinancialCalculator } from "./FinancialCalculator";
import { CashFlowCalculator } from "./CashFlowCalculator";

import { useCalculator } from "../../hooks/useCalculator";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";
import type { Operator } from "../../utils/calculatorUtils";

export function Calculator() {
  const calc = useCalculator();
  const [mode, setMode] = useState<"basic" | "financial" | "cashflow">("basic");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const { key } = event;
      if (key >= "0" && key <= "9") calc.inputDigit(key);
      else if (key === ".") calc.inputDecimal();
      else if (key === "+" || key === "-" || key === "*" || key === "/") calc.chooseOperator(key as Operator);
      else if (key === "=") calc.equals();
      else if (key === "Enter") {
        if (!(document.activeElement instanceof HTMLButtonElement)) calc.equals();
      } else if (key === "Backspace") calc.deleteLast();
      else if (key === "Escape") calc.clear();
      else if (key === "%") calc.percent();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calc]);

  return (
    <div className="relative" style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
      {/* ambient bloom behind the calculator */}
      <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-violet-400/20 blur-3xl dark:bg-violet-600/20" />

      <div className="w-[480px] max-w-[92vw] rounded-2xl border border-violet-300 bg-violet-100/90 p-8 shadow-[0_0_40px_rgba(167,139,250,0.4)] backdrop-blur-xl dark:border-violet-500/30 dark:bg-[#0d0a18]/95 dark:shadow-[0_0_40px_rgba(124,58,237,0.25)]">
        {/* VSCode-style title bar */}
        <div className="mb-4 flex items-center justify-between px-1">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <span className="text-xs text-violet-500/70 dark:text-violet-400/60">calc.tsx</span>
        </div>

        {/* tab toggle */}
        <div className="mb-4 flex gap-1.5 rounded-xl border border-violet-300 bg-violet-50/60 p-1 dark:border-violet-500/20 dark:bg-black/30">
          <button
            type="button"
            onClick={() => setMode("basic")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "basic"
                ? "bg-violet-700 text-white dark:bg-violet-500"
                : "text-violet-600 hover:bg-violet-200/50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            }`}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setMode("financial")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "financial"
                ? "bg-violet-700 text-white dark:bg-violet-500"
                : "text-violet-600 hover:bg-violet-200/50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            }`}
          >
            Financial
          </button>
          <button
            type="button"
            onClick={() => setMode("cashflow")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "cashflow"
                ? "bg-violet-700 text-white dark:bg-violet-500"
                : "text-violet-600 hover:bg-violet-200/50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            }`}
          >
            Cash Flow
          </button>
        </div>

        {mode === "basic" ? (
          <>
            <CalculatorDisplay expression={calc.expression} value={calc.current} />
            <CalculatorKeypad
              onDigit={calc.inputDigit}
              onDecimal={calc.inputDecimal}
              onOperator={calc.chooseOperator}
              onEquals={calc.equals}
              onClear={calc.clear}
              onDelete={calc.deleteLast}
              onPercent={calc.percent}
              onToggleSign={calc.toggleSign}
              onSqrt={calc.squareRoot}
              onSquare={calc.square}
              onReciprocal={calc.reciprocal}
              onPi={calc.pi}
            />
          </>
        ) : mode === "financial" ? (
          <FinancialCalculator />
        ) : (
          <CashFlowCalculator />
        )}

        {/* bottom neon hairline */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/70 to-fuchsia-500/0" />
      </div>
    </div>
  );
}