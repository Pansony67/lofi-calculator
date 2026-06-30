// src/components/calculator/CashFlowCalculator.tsx
import { useState } from "react";
import { CalculatorButton } from "./CalculatorButton";
import { solveNPV, solveIRR, formatMoney } from "../../utils/financialUtils";

export function CashFlowCalculator() {
  // list of cash flow amounts (as strings while typing). Start with CF0 and CF1.
  const [flows, setFlows] = useState<string[]>(["-1000", "0"]);
  const [rate, setRate] = useState("10"); // discount rate for NPV
  const [result, setResult] = useState<string>("—");
  const [resultLabel, setResultLabel] = useState("Result");

  function updateFlow(index: number, value: string) {
    setFlows((f) => f.map((item, i) => (i === index ? value : item)));
  }

  function addFlow() {
    setFlows((f) => [...f, "0"]);
  }

  function removeFlow(index: number) {
    if (flows.length <= 2) return; // keep at least CF0 + CF1
    setFlows((f) => f.filter((_, i) => i !== index));
  }

  function clearAll() {
    setFlows(["-1000", "0"]);
    setRate("10");
    setResult("—");
    setResultLabel("Result");
  }

  // turn the string inputs into numbers (blank = 0)
  function asNumbers(): number[] {
    return flows.map((f) => parseFloat(f) || 0);
  }

  function computeNPV() {
    const r = parseFloat(rate) || 0;
    const value = solveNPV(r, asNumbers());
    setResultLabel(`NPV at ${r}%`);
    setResult(Number.isFinite(value) ? formatMoney(value) : "Error");
  }

  function computeIRR() {
    const value = solveIRR(asNumbers());
    setResultLabel("IRR");
    setResult(Number.isFinite(value) ? formatMoney(value) + " %" : "No solution");
  }

  return (
    <div>
      {/* discount rate input */}
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50/80 px-4 py-2 dark:border-violet-500/20 dark:bg-black/40">
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400/80">RATE %</span>
        <input
          type="text"
          inputMode="decimal"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="flex-1 bg-transparent text-right text-lg font-semibold text-violet-800 outline-none dark:text-violet-200"
        />
      </div>

      {/* cash flow list */}
      <div className="mb-3 max-h-52 space-y-2 overflow-y-auto pr-1">
        {flows.map((flow, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50/80 px-3 py-2 dark:border-violet-500/20 dark:bg-black/30"
          >
            <span className="w-10 text-xs font-semibold text-violet-600 dark:text-violet-400/80">
              CF{index}
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={flow}
              onChange={(e) => updateFlow(index, e.target.value)}
              className="flex-1 bg-transparent text-right text-base font-semibold text-violet-800 outline-none dark:text-violet-200"
            />
            <button
              type="button"
              onClick={() => removeFlow(index)}
              className="px-2 text-violet-400 hover:text-violet-600 disabled:opacity-30 dark:hover:text-violet-200"
              disabled={flows.length <= 2}
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* add cash flow */}
      <button
        type="button"
        onClick={addFlow}
        className="mb-4 w-full rounded-xl border border-dashed border-violet-400/60 py-2 text-sm font-medium text-violet-600 hover:bg-violet-200/40 dark:text-violet-300 dark:hover:bg-violet-500/10"
      >
        + Add cash flow
      </button>

      {/* result display */}
      <div className="mb-4 rounded-xl border border-violet-300 bg-violet-50/80 px-5 py-4 text-right dark:border-violet-500/20 dark:bg-black/40">
        <div className="text-xs text-violet-500/70 dark:text-violet-400/70">{resultLabel}</div>
        <div
          className="truncate text-3xl font-semibold text-violet-800 dark:text-violet-200"
          style={{ textShadow: "0 0 18px rgba(124,58,237,0.25)" }}
        >
          {result}
        </div>
      </div>

      {/* action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <CalculatorButton label="NPV" variant="operator" onClick={computeNPV} />
        <CalculatorButton label="IRR" variant="scientific" onClick={computeIRR} />
        <CalculatorButton label="AC" variant="function" onClick={clearAll} ariaLabel="Clear all" />
      </div>
    </div>
  );
}