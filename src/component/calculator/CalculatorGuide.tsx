// src/component/calculator/CalculatorGuide.tsx
/**
 * The written half of the calculator page.
 *
 * A page that is only a widget gives a search engine almost nothing to
 * read, which is why /calculator had no chance of ranking for the very
 * queries it answers. Everything here is real explanation a visitor can
 * use - the FAQ block in particular is visible on purpose, because the
 * FAQPage structured data in src/seo/pageMeta.ts mirrors it and Google
 * requires the questions to be on the page.
 */
import { CALCULATOR_FAQ } from "../../data/calculatorFaq";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="text-base font-semibold text-violet-900 dark:text-violet-200">
        {title}
      </h3>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-violet-950/80 dark:text-violet-100/70">
        {children}
      </div>
    </section>
  );
}

export function CalculatorGuide() {
  return (
    <article className="w-[720px] max-w-[92vw] rounded-2xl border border-violet-300 bg-violet-100/80 p-6 backdrop-blur-xl sm:p-8 dark:border-violet-500/30 dark:bg-[#0d0a18]/90">
      <h2 className="text-xl font-semibold text-violet-900 dark:text-violet-100">
        What NPV and IRR mean, and how to read your result
      </h2>

      <Section title="NPV - net present value">
        <p>
          A dollar today is worth more than a dollar five years from now,
          because today&apos;s dollar can be put to work in the meantime. NPV
          takes every future cash flow, discounts each one back to what it is
          worth today, and subtracts the money you invested at the start.
        </p>
        <p className="font-mono text-xs text-violet-800 dark:text-violet-300">
          NPV = CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n - CF0
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>NPV above 0 - the project adds value; worth doing</li>
          <li>NPV below 0 - the return does not cover the cost of capital</li>
          <li>NPV at 0 - it breaks even exactly at the rate you set</li>
        </ul>
      </Section>

      <Section title="IRR - internal rate of return">
        <p>
          IRR is the discount rate that drives NPV to zero. Another way to see
          it: the annual return the project actually earns. You use it by
          comparing it against the lowest return you are willing to accept - if
          the IRR clears that bar, the project passes.
        </p>
        <p>
          One caveat: when the cash flows change sign more than once, a single
          project can have several valid IRRs. In that situation, decide on NPV
          instead.
        </p>
      </Section>

      <Section title="A worked example">
        <p>
          Invest 100,000 today, then collect 30,000 a year for five years, at a
          discount rate of 8% a year.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The five payments are worth roughly 119,781 in today&apos;s money
          </li>
          <li>
            NPV = 119,781 - 100,000 = about 19,781, which is positive, so the
            project is worth taking
          </li>
          <li>
            The IRR of that cash flow works out to roughly 15.2% a year,
            comfortably above the 8% required
          </li>
        </ul>
        <p>
          Type it into the Cash flow mode above to see it: enter -100000 as CF0,
          then 30000 five times.
        </p>
      </Section>

      <Section title="Frequently asked questions">
        <dl className="space-y-4">
          {CALCULATOR_FAQ.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-violet-900 dark:text-violet-200">
                {item.q}
              </dt>
              <dd className="mt-1">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </article>
  );
}
