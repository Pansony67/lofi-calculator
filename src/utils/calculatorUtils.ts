// src/utils/calculatorUtils.ts

// Internal operator values are ASCII so they match keyboard input
export type Operator = "+" | "-" | "*" | "/";

// Pretty symbols shown on buttons and in the expression line.
export const OPERATOR_SYMBOLS: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};
// Core math. No eval(), no Function() — just a switch.
export function calculate(a: number, b: number, operator: Operator): number {
    switch (operator) {
     case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b; // guard division by zero
    default:
      return b;
  }
  }

  // Turns a number into a clean display string.
  // toPrecision(12) + parseFloat removes floating-point noise (e.g. 0.1 + 0.2).
  export function formatNumber(value: number): string {
       if (!Number.isFinite(value)) return "Error";
    return String(parseFloat(value.toPrecision(12)));
  }