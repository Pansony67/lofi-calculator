// src/components/calculator/CalculatorKeypad.tsx
import { CalculatorButton } from "./CalculatorButton";
import { OPERATOR_SYMBOLS, type Operator } from "../../utils/calculatorUtils";

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (operator: Operator) => void;
  onEquals: () => void;
  onClear: () => void;
  onDelete: () => void;
  onPercent: () => void;
  onToggleSign: () => void;
  onSqrt: () => void;
  onSquare: () => void;
  onReciprocal: () => void;
  onPi: () => void;
}

export function CalculatorKeypad({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
  onDelete,
  onPercent,
  onToggleSign,
  onSqrt,
  onSquare,
  onReciprocal,
  onPi,
}: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {/* Scientific row */}
      <CalculatorButton label="√" variant="scientific" onClick={onSqrt} ariaLabel="Square root" />
      <CalculatorButton label="x²" variant="scientific" onClick={onSquare} ariaLabel="Square" />
      <CalculatorButton label="1/x" variant="scientific" onClick={onReciprocal} ariaLabel="Reciprocal" />
      <CalculatorButton label="π" variant="scientific" onClick={onPi} ariaLabel="Pi" />

      {/* Row 1 */}
      <CalculatorButton label="AC" variant="function" onClick={onClear} ariaLabel="Clear all" />
      <CalculatorButton label="+/−" variant="function" onClick={onToggleSign} ariaLabel="Toggle sign" />
      <CalculatorButton label="%" variant="function" onClick={onPercent} ariaLabel="Percent" />
      <CalculatorButton label={OPERATOR_SYMBOLS["/"]} variant="operator" onClick={() => onOperator("/")} ariaLabel="Divide" />

      {/* Row 2 */}
      <CalculatorButton label="7" onClick={() => onDigit("7")} />
      <CalculatorButton label="8" onClick={() => onDigit("8")} />
      <CalculatorButton label="9" onClick={() => onDigit("9")} />
      <CalculatorButton label={OPERATOR_SYMBOLS["*"]} variant="operator" onClick={() => onOperator("*")} ariaLabel="Multiply" />

      {/* Row 3 */}
      <CalculatorButton label="4" onClick={() => onDigit("4")} />
      <CalculatorButton label="5" onClick={() => onDigit("5")} />
      <CalculatorButton label="6" onClick={() => onDigit("6")} />
      <CalculatorButton label={OPERATOR_SYMBOLS["-"]} variant="operator" onClick={() => onOperator("-")} ariaLabel="Subtract" />

      {/* Row 4 */}
      <CalculatorButton label="1" onClick={() => onDigit("1")} />
      <CalculatorButton label="2" onClick={() => onDigit("2")} />
      <CalculatorButton label="3" onClick={() => onDigit("3")} />
      <CalculatorButton label={OPERATOR_SYMBOLS["+"]} variant="operator" onClick={() => onOperator("+")} ariaLabel="Add" />

      {/* Row 5 */}
      <CalculatorButton label="⌫" variant="function" onClick={onDelete} ariaLabel="Delete" />
      <CalculatorButton label="0" onClick={() => onDigit("0")} />
      <CalculatorButton label="." onClick={onDecimal} ariaLabel="Decimal point" />
      <CalculatorButton label="=" variant="equals" onClick={onEquals} ariaLabel="Equals" />
    </div>
  );
}