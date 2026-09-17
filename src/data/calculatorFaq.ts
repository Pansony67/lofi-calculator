// src/data/calculatorFaq.ts
/**
 * One source of truth for the calculator FAQ.
 *
 * CalculatorGuide.tsx renders it on the page and src/seo/pageMeta.ts
 * turns it into FAQPage structured data. Google only honours FAQPage
 * when the same questions and answers are visible to the reader, so
 * these two must never drift apart - hence one file, two importers.
 */
export type Faq = { q: string; a: string };

export const CALCULATOR_FAQ: Faq[] = [
  {
    q: "What is NPV?",
    a: "NPV, or net present value, takes every cash flow a project will pay out in the future, converts each one back into what it is worth today using a discount rate, and subtracts the money you put in at the start. A positive NPV means the project creates value above the cost of the capital funding it.",
  },
  {
    q: "What is IRR?",
    a: "IRR, or internal rate of return, is the discount rate at which NPV comes out to exactly zero. Read it as the annual return the project actually earns. If the IRR clears the minimum return you are willing to accept, the project passes that test.",
  },
  {
    q: "What is the difference between NPV and IRR, and which one should I trust?",
    a: "NPV answers in money, IRR answers in percent. When two projects disagree, follow NPV: it tells you how much value is actually added, while IRR is a ratio that says nothing about the size of the project. A 40% return on a tiny project can be worth less than a 12% return on a large one.",
  },
  {
    q: "What discount rate should I use?",
    a: "Use the cost of the capital behind the project. For a personal investment that usually means the return you could get elsewhere at similar risk; for a company it is normally the weighted average cost of capital. The riskier the project, the higher the rate should be.",
  },
  {
    q: "Why can't the calculator find an IRR?",
    a: "IRR only has a solution when the cash flows change sign at least once. If every period is positive, or every period is negative, there is no rate that makes NPV zero. The usual cause is forgetting to enter the initial investment (CF0) as a negative number.",
  },
];
