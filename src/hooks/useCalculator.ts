// src/hooks/useCalculator.ts
import { useState, useEffect } from "react";
import {
  calculate,
  formatNumber,
  OPERATOR_SYMBOLS,
  type Operator,
} from "../utils/calculatorUtils";

// load saved basic-calculator state (if any) from localStorage
function loadSaved() {
  try {
    const raw = localStorage.getItem("lofi-calc-basic");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function useCalculator() {
  const saved = loadSaved();
  const [current, setCurrent] = useState<string>(saved?.current ?? "0");
  const [expression, setExpression] = useState<string>(saved?.expression ?? "");
  const [previous, setPrevious] = useState<number | null>(saved?.previous ?? null);
  const [operator, setOperator] = useState<Operator | null>(saved?.operator ?? null);
  const [overwrite, setOverwrite] = useState<boolean>(saved?.overwrite ?? true);

  const isError = current === "Error";

  // save basic-calculator state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "lofi-calc-basic",
        JSON.stringify({ current, expression, previous, operator, overwrite })
      );
    } catch {}
  }, [current, expression, previous, operator, overwrite]);

  function inputDigit(digit: string) {
    if (overwrite || isError) {
      setCurrent(digit);
      setOverwrite(false);
      if (previous === null) setExpression("");
      return;
    }
    setCurrent(current === "0" ? digit : current + digit);
  }

  function inputDecimal() {
    if (overwrite || isError) {
      setCurrent("0.");
      setOverwrite(false);
      if (previous === null) setExpression("");
      return;
    }
    if (current.includes(".")) return;
    setCurrent(current + ".");
  }

  function chooseOperator(nextOperator: Operator) {
    if (isError) return;
    const currentValue = parseFloat(current);

    let newPrevious: number;

    if (previous === null) {
      newPrevious = currentValue;
    } else if (overwrite) {
      newPrevious = previous;
    } else {
      const result = calculate(previous, currentValue, operator!);
      if (!Number.isFinite(result)) {
        showError();
        return;
      }
      newPrevious = result;
      setCurrent(formatNumber(result));
    }

    setPrevious(newPrevious);
    setOperator(nextOperator);
    setOverwrite(true);
    setExpression(`${formatNumber(newPrevious)} ${OPERATOR_SYMBOLS[nextOperator]}`);
  }

  function equals() {
    if (isError || operator === null || previous === null) return;
    const currentValue = parseFloat(current);
    const result = calculate(previous, currentValue, operator);

    if (!Number.isFinite(result)) {
      showError();
      return;
    }

    setExpression(
      `${formatNumber(previous)} ${OPERATOR_SYMBOLS[operator]} ${formatNumber(currentValue)} =`
    );
    setCurrent(formatNumber(result));
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }

  function clear() {
    setCurrent("0");
    setExpression("");
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }

  function deleteLast() {
    if (isError) {
      clear();
      return;
    }
    if (overwrite) return;
    if (current.length === 1 || (current.length === 2 && current.startsWith("-"))) {
      setCurrent("0");
      setOverwrite(true);
      return;
    }
    setCurrent(current.slice(0, -1));
  }

  function percent() {
    if (isError) return;
    setCurrent(formatNumber(parseFloat(current) / 100));
    setOverwrite(true);
  }

  function toggleSign() {
    if (isError) return;
    if (parseFloat(current) === 0) return;
    setCurrent(current.startsWith("-") ? current.slice(1) : "-" + current);
  }

  // --- scientific functions (act on the current number instantly) ---

  function squareRoot() {
    if (isError) return;
    const value = Math.sqrt(parseFloat(current));
    if (!Number.isFinite(value)) {
      showError(); // e.g. square root of a negative number
      return;
    }
    setCurrent(formatNumber(value));
    setOverwrite(true);
  }

  function square() {
    if (isError) return;
    const value = parseFloat(current) ** 2;
    if (!Number.isFinite(value)) {
      showError();
      return;
    }
    setCurrent(formatNumber(value));
    setOverwrite(true);
  }

  function reciprocal() {
    if (isError) return;
    const n = parseFloat(current);
    if (n === 0) {
      showError(); // 1 / 0 is not allowed
      return;
    }
    setCurrent(formatNumber(1 / n));
    setOverwrite(true);
  }

  function pi() {
    if (isError) return;
    setCurrent(formatNumber(Math.PI));
    setOverwrite(true);
  }

  function showError() {
    setCurrent("Error");
    setExpression("");
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  }

  return {
    current,
    expression,
    inputDigit,
    inputDecimal,
    chooseOperator,
    equals,
    clear,
    deleteLast,
    percent,
    toggleSign,
    squareRoot,
    square,
    reciprocal,
    pi,
  };
}