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
 *
 * Thai first: that is what the calculator itself speaks, and the Thai
 * queries are the ones worth competing for.
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
    <article
      lang="th"
      className="w-[720px] max-w-[92vw] rounded-2xl border border-violet-300 bg-violet-100/80 p-6 backdrop-blur-xl sm:p-8 dark:border-violet-500/30 dark:bg-[#0d0a18]/90"
    >
      <h2 className="text-xl font-semibold text-violet-900 dark:text-violet-100">
        NPV และ IRR คืออะไร อ่านผลลัพธ์อย่างไร
      </h2>

      <Section title="NPV - มูลค่าปัจจุบันสุทธิ">
        <p>
          เงินหนึ่งบาทวันนี้มีค่ามากกว่าเงินหนึ่งบาทในอีกห้าปีข้างหน้า เพราะเงินวันนี้เอาไปลงทุนต่อได้
          NPV คือการดึงกระแสเงินสดที่จะได้รับในอนาคตทุกงวดกลับมาเป็นมูลค่าวันนี้ด้วยอัตราคิดลด
          แล้วหักด้วยเงินลงทุนตั้งต้น
        </p>
        <p className="font-mono text-xs text-violet-800 dark:text-violet-300">
          NPV = CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n - CF0
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>NPV มากกว่า 0 - โครงการสร้างมูลค่าเพิ่ม น่าลงทุน</li>
          <li>NPV น้อยกว่า 0 - ผลตอบแทนไม่คุ้มต้นทุนเงินทุน</li>
          <li>NPV เท่ากับ 0 - คุ้มทุนพอดีที่อัตราที่ตั้งไว้</li>
        </ul>
      </Section>

      <Section title="IRR - อัตราผลตอบแทนภายใน">
        <p>
          IRR คืออัตราคิดลดที่ทำให้ NPV เท่ากับศูนย์ มองอีกมุมคือผลตอบแทนต่อปีที่โครงการให้จริง
          วิธีใช้คือเอาไปเทียบกับอัตราผลตอบแทนขั้นต่ำที่เรายอมรับได้ ถ้า IRR สูงกว่า ก็ผ่าน
        </p>
        <p>
          ข้อควรระวัง: ถ้ากระแสเงินสดสลับเครื่องหมายหลายครั้ง โครงการหนึ่งอาจมี IRR ได้หลายค่า
          กรณีแบบนั้นให้ตัดสินใจด้วย NPV แทน
        </p>
      </Section>

      <Section title="ตัวอย่างจริง">
        <p>
          ลงทุน 100,000 บาทวันนี้ แล้วได้เงินคืนปีละ 30,000 บาท เป็นเวลา 5 ปี
          ที่อัตราคิดลด 8% ต่อปี
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>มูลค่าปัจจุบันของเงินที่ได้คืนทั้งหมด ประมาณ 119,781 บาท</li>
          <li>NPV = 119,781 - 100,000 = ประมาณ 19,781 บาท ซึ่งเป็นบวก จึงน่าลงทุน</li>
          <li>IRR ของกระแสเงินสดชุดนี้อยู่ที่ประมาณ 15.2% ต่อปี สูงกว่า 8% ที่ตั้งไว้</li>
        </ul>
        <p>
          ลองพิมพ์ตัวเลขชุดนี้ลงในโหมด Cash flow ด้านบนดูได้ CF0 ใส่เป็น -100000
          แล้วตามด้วย 30000 อีกห้างวด
        </p>
      </Section>

      <Section title="คำถามที่พบบ่อย">
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
