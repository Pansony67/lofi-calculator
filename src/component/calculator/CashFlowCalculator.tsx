// src/component/calculator/CashFlowCalculator.tsx
import { useState, useEffect } from "react";
import { CalculatorButton } from "./CalculatorButton";
import { solveNPV, solveIRR, formatMoney } from "../../utils/financialUtils";

// load saved cash-flow data (if any) from localStorage
function loadSavedCF() {
  try {
    const raw = localStorage.getItem("lofi-calc-cashflow");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

// what kind of result we're currently explaining
type Explain =
  | { kind: "none" }
  | { kind: "npv"; value: number; rate: number }
  | { kind: "irr"; value: number; rate: number }
  | { kind: "irr-none" };

export function CashFlowCalculator() {
  const saved = loadSavedCF();
  // list of cash flow amounts (as strings while typing). Start with CF0 and CF1.
  const [flows, setFlows] = useState<string[]>(saved?.flows ?? ["-1000", "0"]);
  const [rate, setRate] = useState<string>(saved?.rate ?? "10"); // discount rate for NPV
  const [result, setResult] = useState<string>(saved?.result ?? "—");
  const [resultLabel, setResultLabel] = useState<string>(saved?.resultLabel ?? "Result");
  const [explain, setExplain] = useState<Explain>(saved?.explain ?? { kind: "none" });
  const [lang, setLang] = useState<"th" | "en">(saved?.lang ?? "th");

  // save cash-flow data whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "lofi-calc-cashflow",
        JSON.stringify({ flows, rate, result, resultLabel, explain, lang })
      );
    } catch {}
  }, [flows, rate, result, resultLabel, explain, lang]);

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
    setExplain({ kind: "none" });
  }

  // turn the string inputs into numbers (blank = 0)
  function asNumbers(): number[] {
    return flows.map((f) => parseFloat(f) || 0);
  }

  function computeNPV() {
    const r = parseFloat(rate) || 0;
    const value = solveNPV(r, asNumbers());
    setResultLabel(`NPV at ${r}%`);
    if (Number.isFinite(value)) {
      setResult(formatMoney(value));
      setExplain({ kind: "npv", value, rate: r });
    } else {
      setResult("Error");
      setExplain({ kind: "none" });
    }
  }

  function computeIRR() {
    const r = parseFloat(rate) || 0;
    const value = solveIRR(asNumbers());
    setResultLabel("IRR");
    if (Number.isFinite(value)) {
      setResult(formatMoney(value) + " %");
      setExplain({ kind: "irr", value, rate: r });
    } else {
      setResult("No solution");
      setExplain({ kind: "irr-none" });
    }
  }

  // build the explanation text based on the last result + language
  function explanation(): { emoji: string; title: string; body: string } | null {
    if (explain.kind === "none") return null;

    if (explain.kind === "npv") {
      const { value } = explain;
      if (value > 0.005) {
        return lang === "th"
          ? {
              emoji: "✅",
              title: "โครงการนี้คุ้มค่า",
              body: `NPV เป็นบวก (${formatMoney(value)}) แปลว่าโครงการสร้างมูลค่าเพิ่มเหนือต้นทุนเงินทุนที่ ${explain.rate}% โดยทั่วไป NPV > 0 = น่าลงทุน`,
            }
          : {
              emoji: "✅",
              title: "This project adds value",
              body: `A positive NPV (${formatMoney(value)}) means the project earns more than your ${explain.rate}% cost of capital. Generally, NPV > 0 = worth investing.`,
            };
      }
      if (value < -0.005) {
        return lang === "th"
          ? {
              emoji: "⚠️",
              title: "โครงการนี้ยังไม่คุ้ม",
              body: `NPV เป็นลบ (${formatMoney(value)}) แปลว่าผลตอบแทนต่ำกว่าต้นทุนเงินทุนที่ ${explain.rate}% โดยทั่วไป NPV < 0 = ควรพิจารณาใหม่`,
            }
          : {
              emoji: "⚠️",
              title: "This project falls short",
              body: `A negative NPV (${formatMoney(value)}) means returns are below your ${explain.rate}% cost of capital. Generally, NPV < 0 = reconsider.`,
            };
      }
      return lang === "th"
        ? {
            emoji: "➖",
            title: "จุดคุ้มทุนพอดี",
            body: `NPV ≈ 0 แปลว่าโครงการให้ผลตอบแทนเท่ากับ rate ที่ตั้งไว้ (${explain.rate}%) พอดี ไม่กำไรไม่ขาดทุนเชิงมูลค่า`,
          }
        : {
            emoji: "➖",
            title: "Exactly break-even",
            body: `NPV ≈ 0 means the project returns exactly your ${explain.rate}% rate — no value gained or lost.`,
          };
    }

    if (explain.kind === "irr") {
      const { value, rate: r } = explain;
      const beats = value > r;
      return lang === "th"
        ? {
            emoji: beats ? "✅" : "⚠️",
            title: beats ? "IRR สูงกว่า rate ที่ต้องการ" : "IRR ต่ำกว่า rate ที่ต้องการ",
            body: `IRR คือผลตอบแทนที่แท้จริงของโครงการ (${formatMoney(value)}%) ${
              beats
                ? `ซึ่งสูงกว่า rate ที่ต้องการ (${r}%) → น่าลงทุน`
                : `ซึ่งต่ำกว่า rate ที่ต้องการ (${r}%) → ยังไม่น่าลงทุน`
            }`,
          }
        : {
            emoji: beats ? "✅" : "⚠️",
            title: beats ? "IRR beats your target rate" : "IRR is below your target rate",
            body: `IRR is the project's true rate of return (${formatMoney(value)}%). ${
              beats
                ? `It's higher than your ${r}% target → worth investing.`
                : `It's lower than your ${r}% target → not worth it yet.`
            }`,
          };
    }

    // irr-none
    return lang === "th"
      ? {
          emoji: "🤔",
          title: "หา IRR ไม่ได้",
          body: "IRR หาค่าไม่ได้ มักเกิดเมื่อกระแสเงินสดไม่มีการสลับเครื่องหมาย (เช่น ไม่มีเงินลงทุนติดลบตอนแรก) ลองตรวจ CF0 ว่าเป็นค่าติดลบ",
        }
      : {
          emoji: "🤔",
          title: "No IRR found",
          body: "IRR can't be solved — usually when cash flows never change sign (e.g. no initial negative investment). Check that CF0 is negative.",
        };
  }

  const exp = explanation();

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

      {/* explanation box (unique feature: explains what the number means) */}
      {exp && (
        <div className="mb-4 rounded-xl border border-violet-400/40 bg-violet-100/70 px-4 py-3 dark:border-violet-500/30 dark:bg-violet-950/30">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-violet-800 dark:text-violet-200">
              <span>{exp.emoji}</span>
              {exp.title}
            </span>
            {/* TH / EN language toggle */}
            <button
              type="button"
              onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
              className="rounded-md border border-violet-400/50 px-2 py-0.5 text-xs font-medium text-violet-600 hover:bg-violet-200/50 dark:text-violet-300 dark:hover:bg-violet-500/10"
            >
              {lang === "th" ? "EN" : "TH"}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-violet-700/90 dark:text-violet-300/80">
            {exp.body}
          </p>
        </div>
      )}

      {/* action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <CalculatorButton label="NPV" variant="operator" onClick={computeNPV} />
        <CalculatorButton label="IRR" variant="scientific" onClick={computeIRR} />
        <CalculatorButton label="AC" variant="function" onClick={clearAll} ariaLabel="Clear all" />
      </div>
    </div>
  );
}