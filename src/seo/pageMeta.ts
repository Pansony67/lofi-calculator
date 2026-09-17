// src/seo/pageMeta.ts
/**
 * Per-route SEO copy and structured data.
 *
 * This is a client-rendered SPA: index.html ships ONE <title> and ONE
 * description, so every route looked identical to a crawler. Google does
 * run JavaScript before indexing, so updating the head on navigation is
 * enough to give each route its own entry in search results.
 *
 * Copy is English, matching the app's own interface. The Thai
 * explanations the calculator gives are called out as a feature rather
 * than being the language of the page itself.
 */

import { CALCULATOR_FAQ } from "../data/calculatorFaq";

export const SITE_URL = "https://lofi-calculator.vercel.app";
export const SITE_NAME = "Lofi Calculator";

const AUTHOR = {
  "@type": "Person",
  name: "Pannadhorn Rugseree",
  url: "https://github.com/Pansony67",
};

export type PageMeta = {
  title: string;
  description: string;
  /** schema.org blocks for this route. */
  jsonLd: Record<string, unknown>[];
};

/** The app itself, described once and reused. */
const webApplication: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: ["th", "en"],
  author: AUTHOR,
  // The app is free and needs no account. Stating that here is what
  // lets Google label the result as free rather than guessing.
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "NPV calculator",
    "IRR calculator",
    "Time value of money",
    "Currency converter",
    "Plain-language explanation of every result",
  ],
};

const website: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: ["th", "en"],
  publisher: AUTHOR,
};

function breadcrumb(name: string, path: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `${SITE_URL}${path}`,
      },
    ],
  };
}

/**
 * FAQPage, built from the very list the page renders. Google only shows
 * these as a rich result when the questions are visible to the reader,
 * which is why the source list lives in src/data/calculatorFaq.ts and
 * both the page and this file read from it.
 */
function faqPage(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CALCULATOR_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Lofi Calculator - Free NPV, IRR and TVM Financial Calculator",
    description:
      "A lofi-themed financial calculator that explains its answers. Work out NPV, IRR and the time value of money, with plain-language explanations in English and Thai, live charts and ambient music. Free, no sign-up.",
    jsonLd: [website, webApplication],
  },
  "/calculator": {
    title: "NPV and IRR Calculator Online - Lofi Calculator",
    description:
      "Calculate NPV, IRR and discounted cash flows online for free, with a chart and a plain-language reading of what the numbers actually mean. Nothing to install, no account needed.",
    jsonLd: [webApplication, breadcrumb("Calculator", "/calculator"), faqPage()],
  },
  "/converter": {
    title: "Currency Converter with Live Exchange Rates - Lofi Calculator",
    description:
      "Convert between dozens of currencies at up-to-date exchange rates - dollars, euros, yen, pounds, Thai baht and more - in a calm lofi interface.",
    jsonLd: [breadcrumb("Currency converter", "/converter")],
  },
  "/financial": {
    title: "Latest Financial and Market News - Lofi Calculator",
    description:
      "Financial and market headlines in one quiet place, with the lofi soundtrack still playing while you read.",
    jsonLd: [breadcrumb("Financial news", "/financial")],
  },
  "/about": {
    title: "About Lofi Calculator",
    description:
      "Lofi Calculator is a financial calculator built to be understood - it does not just hand you a number, it tells you what the number means.",
    jsonLd: [breadcrumb("About", "/about")],
  },
  "/contact": {
    title: "Contact - Lofi Calculator",
    description:
      "Get in touch with the developer of Lofi Calculator about feedback, bugs, or working together.",
    jsonLd: [breadcrumb("Contact", "/contact")],
  },
};

/** Unknown paths redirect home, so they get the home entry. */
export function metaForPath(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PAGES[clean] ?? PAGES["/"];
}
