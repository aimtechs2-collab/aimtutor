"use client";

import type { Translations } from "@/translations/en";
import { t } from "@/lib/i18n";

export default function HomeFAQSection({ cityTitle, translations: tt }: { cityTitle: string; translations: Translations }) {
  const faqs = tt.faq.questions;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section className="bg-gray-50 py-16" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {tt.faq.heading}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t(tt.faq.description, { city: cityTitle })}
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-white rounded-xl shadow-md mb-4 p-6 group border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-800 group-hover:text-blue-600">
                <span className="pr-4">{faq.question}</span>
                <svg
                  className="w-6 h-6 flex-shrink-0 text-blue-600 transition-transform duration-300 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
