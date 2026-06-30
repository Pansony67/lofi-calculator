// src/hooks/useFinancial.ts
import { useState } from "react";
import {
  solveFV,
  solvePV,
  solvePMT,
  solveN,
  solveIY,
  type TvmValues,
} from "../utils/financialUtils";

type TvmKey = "n" | "iy" | "pv" | "pmt" | "fv";

const EMPTY: TvmValues = { n: null, iy: null, pv: null, pmt: null, fv: null };

export function useFinancial() {
  const [values, setValues] = useState<TvmValues>(EMPTY);
  const [entry, setEntry] = useState("0");   // the number being typed
  const [computeMode, setComputeMode] = useState(false); // true after CPT is pressed
  const [message, setMessage] = useState("Enter 4 values, then CPT + the unknown");

  function inputDigit(digit: string) {
    setComputeMode(false);
    setEntry((e) => (e === "0" ? digit : e + digit));
  }

  function inputDecimal() {
    setComputeMode(false);
    setEntry((e) => (e.includes(".") ? e : e + "."));
  }

  function toggleSign() {
    setEntry((e) => (e.startsWith("-") ? e.slice(1) : "-" + e));
  }

  function clearEntry() {
    setEntry("0");
  }

  function clearAll() {
    setValues(EMPTY);
    setEntry("0");
    setComputeMode(false);
    setMessage("Enter 4 values, then CPT + the unknown");
  }

  function deleteLast() {
    setEntry((e) => (e.length <= 1 || (e.length === 2 && e.startsWith("-")) ? "0" : e.slice(0, -1)));
  }

  // Pressing CPT means "the next variable button is the one to solve for".
  function compute() {
    setComputeMode(true);
    setMessage("Now press the variable to solve for");
  }

  // Pressing a variable key: either store the entry, or (if in compute mode) solve for it.
  function pressVariable(key: TvmKey) {
    if (computeMode) {
      solveFor(key);
      return;
    }
    const num = parseFloat(entry);
    setValues((v) => ({ ...v, [key]: num }));
    setEntry("0");
    setMessage(`Stored ${key.toUpperCase()} = ${num}`);
  }

  function solveFor(key: TvmKey) {
    setComputeMode(false);
    const { n, iy, pv, pmt, fv } = values;

    // helper: make sure the other 4 are filled in
    const need = (...xs: (number | null)[]) => xs.every((x) => x !== null);

    let result: number;

    if (key === "fv") {
      if (!need(n, iy, pv, pmt)) return missing();
      result = solveFV(n!, iy!, pv!, pmt!);
    } else if (key === "pv") {
      if (!need(n, iy, pmt, fv)) return missing();
      result = solvePV(n!, iy!, pmt!, fv!);
    } else if (key === "pmt") {
      if (!need(n, iy, pv, fv)) return missing();
      result = solvePMT(n!, iy!, pv!, fv!);
    } else if (key === "n") {
      if (!need(iy, pv, pmt, fv)) return missing();
      result = solveN(iy!, pv!, pmt!, fv!);
    } else {
      // iy — uses iteration
      if (!need(n, pv, pmt, fv)) return missing();
      result = solveIY(n!, pv!, pmt!, fv!);
    }

    if (!Number.isFinite(result)) {
      setMessage("Can't solve with these values");
      return;
    }

    setValues((v) => ({ ...v, [key]: result }));
    setMessage(`Solved ${key.toUpperCase()}`);
  }

  function missing() {
    setMessage("Fill the other 4 values first");
  }

  return {
    values,
    entry,
    message,
    computeMode,
    inputDigit,
    inputDecimal,
    toggleSign,
    clearEntry,
    clearAll,
    deleteLast,
    compute,
    pressVariable,
  };
}