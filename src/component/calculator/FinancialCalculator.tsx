// src/components/calculator/FinancialCalculator.tsx
import { useFinancial } from "../../hooks/useFinancial";
import { CalculatorButton } from "./CalculatorButton";
import { formatMoney, type TvmValues } from "../../utils/financialUtils";

// little label/value chip for each stored TVM variable
function TvmChip({ label, value, active }: { label: string; value: number | null; active: boolean }) {
  return (
    <div
      className={`rounded-lg border px-2 py-2 text-center ${
        active
          ? "border-violet-400 bg-violet-200/60 dark:border-violet-400/70 dark:bg-violet-500/20"
          : "border-violet-300 bg-violet-50/60 dark:border-violet-500/20 dark:bg-black/30"
      }`}
    >
      <div className="text-[10px] font-semibold tracking-wider text-violet-600 dark:text-violet-400/80">
        {label}
      </div>
      <div className="truncate text-sm font-semibold text-violet-900 dark:text-violet-100">
        {formatMoney(value)}
      </div>
    </div>
  );
}

export function FinancialCalculator() {
  const fin = useFinancial();
  const v: TvmValues = fin.values;

  return (
    <div>
      {/* 5 TVM variable chips */}
      <div className="mb-3 grid grid-cols-5 gap-2">
        <TvmChip label="N" value={v.n} active={fin.computeMode} />
        <TvmChip label="I/Y" value={v.iy} active={fin.computeMode} />
        <TvmChip label="PV" value={v.pv} active={fin.computeMode} />
        <TvmChip label="PMT" value={v.pmt} active={fin.computeMode} />
        <TvmChip label="FV" value={v.fv} active={fin.computeMode} />
      </div>

      {/* current entry display */}
      <div className="mb-2 rounded-xl border border-violet-300 bg-violet-50/80 px-5 py-4 text-right dark:border-violet-500/20 dark:bg-black/40">
        <div
          className="truncate text-3xl font-semibold text-violet-800 dark:text-violet-200"
          style={{ textShadow: "0 0 18px rgba(124,58,237,0.25)" }}
        >
          {fin.entry}
        </div>
      </div>

      {/* helper message */}
      <div className="mb-3 h-4 text-center text-xs text-violet-500/80 dark:text-violet-400/70">
        {fin.message}
      </div>

      {/* TVM variable keys */}
      <div className="mb-3 grid grid-cols-5 gap-2">
        <CalculatorButton label="N" variant="operator" onClick={() => fin.pressVariable("n")} />
        <CalculatorButton label="I/Y" variant="operator" onClick={() => fin.pressVariable("iy")} ariaLabel="Interest per year" />
        <CalculatorButton label="PV" variant="operator" onClick={() => fin.pressVariable("pv")} ariaLabel="Present value" />
        <CalculatorButton label="PMT" variant="operator" onClick={() => fin.pressVariable("pmt")} ariaLabel="Payment" />
        <CalculatorButton label="FV" variant="operator" onClick={() => fin.pressVariable("fv")} ariaLabel="Future value" />
      </div>

      {/* CPT + edit keys */}
      <div className="mb-3 grid grid-cols-4 gap-3">
        <CalculatorButton label="CPT" variant="scientific" onClick={fin.compute} ariaLabel="Compute" />
        <CalculatorButton label="AC" variant="function" onClick={fin.clearAll} ariaLabel="Clear all" />
        <CalculatorButton label="CE" variant="function" onClick={fin.clearEntry} ariaLabel="Clear entry" />
        <CalculatorButton label="⌫" variant="function" onClick={fin.deleteLast} ariaLabel="Delete" />
      </div>

      {/* number pad */}
      <div className="grid grid-cols-4 gap-3">
        <CalculatorButton label="7" onClick={() => fin.inputDigit("7")} />
        <CalculatorButton label="8" onClick={() => fin.inputDigit("8")} />
        <CalculatorButton label="9" onClick={() => fin.inputDigit("9")} />
        <CalculatorButton label="+/−" variant="function" onClick={fin.toggleSign} ariaLabel="Toggle sign" />

        <CalculatorButton label="4" onClick={() => fin.inputDigit("4")} />
        <CalculatorButton label="5" onClick={() => fin.inputDigit("5")} />
        <CalculatorButton label="6" onClick={() => fin.inputDigit("6")} />
        <CalculatorButton label="." onClick={fin.inputDecimal} ariaLabel="Decimal" />

        <CalculatorButton label="1" onClick={() => fin.inputDigit("1")} />
        <CalculatorButton label="2" onClick={() => fin.inputDigit("2")} />
        <CalculatorButton label="3" onClick={() => fin.inputDigit("3")} />
        <CalculatorButton label="0" onClick={() => fin.inputDigit("0")} />
      </div>
    </div>
  );
}