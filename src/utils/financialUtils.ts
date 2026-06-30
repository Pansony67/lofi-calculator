// src/utils/financialUtils.ts

// The 5 TVM variables. null means "not entered yet".
export interface TvmValues {
  n: number | null;      // number of periods
  iy: number | null;     // interest rate % per period
  pv: number | null;     // present value
  pmt: number | null;    // payment per period
  fv: number | null;     // future value
}

// The core TVM relationship that ties all 5 together:
//   PV*(1+i)^N + PMT*[((1+i)^N - 1)/i] + FV = 0
// where i = iy/100. We rearrange this equation to solve for each unknown.

// Solve for Future Value
export function solveFV(n: number, iy: number, pv: number, pmt: number): number {
  const i = iy / 100;
  if (i === 0) return -(pv + pmt * n); // no-interest case
  const growth = Math.pow(1 + i, n);
  return -(pv * growth + pmt * ((growth - 1) / i));
}

// Solve for Present Value
export function solvePV(n: number, iy: number, pmt: number, fv: number): number {
  const i = iy / 100;
  if (i === 0) return -(fv + pmt * n);
  const growth = Math.pow(1 + i, n);
  return -(fv + pmt * ((growth - 1) / i)) / growth;
}

// Solve for Payment
export function solvePMT(n: number, iy: number, pv: number, fv: number): number {
  const i = iy / 100;
  if (i === 0) return -(pv + fv) / n;
  const growth = Math.pow(1 + i, n);
  return -(fv + pv * growth) / ((growth - 1) / i);
}

// Solve for Interest rate (no clean formula — uses "guess and check" / bisection).
// We find the rate that makes the TVM equation balance to zero.
export function solveIY(n: number, pv: number, pmt: number, fv: number): number {
  // This helper returns how "off" the equation is for a given rate guess.
  // When it returns 0, we've found the correct rate.
  const tvmError = (iy: number): number => {
    const i = iy / 100;
    if (i === 0) return pv + pmt * n + fv; // no-interest case
    const growth = Math.pow(1 + i, n);
    return pv * growth + pmt * ((growth - 1) / i) + fv;
  };

  // Bisection: we search between a very low and very high rate,
  // repeatedly cutting the range in half toward the answer.
  let low = -99.9999;  // rate can't go below -100%
  let high = 1000;     // upper bound for the search
  let errLow = tvmError(low);

  // If both ends have the same sign, there's no rate that solves it.
  if (errLow * tvmError(high) > 0) return NaN;

  // Repeat up to 200 times, or until we're close enough.
  for (let step = 0; step < 200; step++) {
    const mid = (low + high) / 2;
    const errMid = tvmError(mid);

    if (Math.abs(errMid) < 1e-7) return mid; // close enough — done!

    // Keep whichever half still contains the sign change.
    if (errLow * errMid < 0) {
      high = mid;
    } else {
      low = mid;
      errLow = errMid;
    }
  }

  return (low + high) / 2; // best estimate after all steps
}
// Solve for Number of periods (needs a logarithm)
export function solveN(iy: number, pv: number, pmt: number, fv: number): number {
  const i = iy / 100;
  if (i === 0) {
    if (pmt === 0) return NaN; // can't solve
    return -(pv + fv) / pmt;
  }
  // Derived by isolating N from the TVM equation, then taking log.
  const numerator = pmt - fv * i;
  const denominator = pmt + pv * i;
  if (denominator === 0 || numerator / denominator <= 0) return NaN;
  return Math.log(numerator / denominator) / Math.log(1 + i);
}

// Clean number formatting for display (2 decimals, handles bad values).
export function formatMoney(value: number | null): string {
  if (value === null) return "—";
  if (!Number.isFinite(value)) return "Error";
  return parseFloat(value.toFixed(2)).toLocaleString("en-US");
}

// --- Cash Flow functions (uneven payments) ---
// cashFlows[0] is the money at time 0 (usually negative = your investment).
// cashFlows[1], [2], ... are what you get back each period.

// NPV: discount every future cash flow back to today's value, then sum them.
// If NPV > 0 the investment beats the given rate; if < 0 it doesn't.
export function solveNPV(rate: number, cashFlows: number[]): number {
  const i = rate / 100;
  let total = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    total += cashFlows[t] / Math.pow(1 + i, t); // each year's value brought to "now"
  }
  return total;
}

// IRR: the rate that makes NPV exactly 0. No formula — same bisection as I/Y.
export function solveIRR(cashFlows: number[]): number {
  // reuse NPV as the "how far off from zero" test
  let low = -99.9999;
  let high = 1000;
  let npvLow = solveNPV(low, cashFlows);

  if (npvLow * solveNPV(high, cashFlows) > 0) return NaN; // no sign change = no answer

  for (let step = 0; step < 200; step++) {
    const mid = (low + high) / 2;
    const npvMid = solveNPV(mid, cashFlows);

    if (Math.abs(npvMid) < 1e-7) return mid; // close enough

    if (npvLow * npvMid < 0) {
      high = mid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }
  return (low + high) / 2;
}