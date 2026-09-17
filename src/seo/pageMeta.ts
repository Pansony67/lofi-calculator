// src/seo/pageMeta.ts
/**
 * Per-route SEO copy and structured data.
 *
 * This is a client-rendered SPA: index.html ships ONE <title> and ONE
 * description, so every route looked identical to a crawler. Google does
 * run JavaScript before indexing, so updating the head on navigation is
 * enough to give each route its own entry in search results.
 *
 * The Thai wording is deliberate. "NPV calculator" in English competes
 * with Calculator.net and Omni; "เครื่องคิดเลข NPV" has far fewer
 * contenders, and the app already explains its results in Thai.
 */

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

const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Lofi Calculator - เครื่องคิดเลขการเงิน NPV IRR และ TVM ฟรี",
    description:
      "เครื่องคิดเลขการเงินธีมโลไฟ คำนวณ NPV, IRR และ Time Value of Money พร้อมคำอธิบายผลลัพธ์เป็นภาษาไทยและอังกฤษ ใช้ฟรี ไม่ต้องสมัครสมาชิก",
    jsonLd: [website, webApplication],
  },
  "/calculator": {
    title: "เครื่องคิดเลข NPV และ IRR ออนไลน์ - Lofi Calculator",
    description:
      "คำนวณ NPV, IRR และกระแสเงินสดออนไลน์ได้ฟรี พร้อมกราฟและคำอธิบายว่าตัวเลขที่ได้หมายความว่าอะไร ไม่ต้องติดตั้งโปรแกรม",
    jsonLd: [webApplication, breadcrumb("Calculator", "/calculator")],
  },
  "/converter": {
    title: "แปลงสกุลเงิน อัตราแลกเปลี่ยนล่าสุด - Lofi Calculator",
    description:
      "แปลงสกุลเงินด้วยอัตราแลกเปลี่ยนล่าสุด รองรับบาท ดอลลาร์ ยูโร เยน ปอนด์ และอีกหลายสิบสกุลเงิน ใช้งานฟรีในธีมโลไฟ",
    jsonLd: [breadcrumb("Currency converter", "/converter")],
  },
  "/financial": {
    title: "ข่าวการเงินและตลาดทุนล่าสุด - Lofi Calculator",
    description:
      "รวมข่าวการเงินและตลาดทุนอัปเดตล่าสุด อ่านง่ายในธีมโลไฟ พร้อมฟังเพลงไปด้วยระหว่างติดตามข่าว",
    jsonLd: [breadcrumb("Financial news", "/financial")],
  },
  "/about": {
    title: "เกี่ยวกับ Lofi Calculator",
    description:
      "Lofi Calculator คือเครื่องคิดเลขการเงินที่ตั้งใจให้เข้าใจง่าย ไม่ใช่แค่ให้ตัวเลข แต่บอกด้วยว่าตัวเลขนั้นแปลว่าอะไร",
    jsonLd: [breadcrumb("About", "/about")],
  },
  "/contact": {
    title: "ติดต่อ - Lofi Calculator",
    description:
      "ติดต่อผู้พัฒนา Lofi Calculator สำหรับข้อเสนอแนะ รายงานปัญหา หรือโอกาสร่วมงาน",
    jsonLd: [breadcrumb("Contact", "/contact")],
  },
};

/** Unknown paths redirect home, so they get the home entry. */
export function metaForPath(pathname: string): PageMeta {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PAGES[clean] ?? PAGES["/"];
}
