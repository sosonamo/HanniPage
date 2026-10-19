import React, { useState } from 'react';
import { type FaqItem } from '../types';
import { faqContent } from '../data/clubContent';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';



interface FaqSectionProps {
  faqs: FaqItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const categories = ['전체', ...new Set([...faqContent.categories, ...faqs.map(item => item.category)].filter(category => category !== '전체'))];
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'전체' | FaqItem['category']>('전체');

  const filteredFaqs = selectedCategory === '전체'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-slate-950 text-white relative border-b border-slate-800">
      <div className="site-container space-y-10">
        
        {/* Section Header */}
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-white border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="heading-label-icon text-orange-400" />
            {faqContent.label}
          </div>
          <h2 className="heading-section text-white tracking-tight">
            <span className="heading-accent">{faqContent.titleAccent}</span>{faqContent.title}
          </h2>
          <p className="text-sm text-slate-400">
            {faqContent.description}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenId(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat} ({cat === '전체' ? faqs.length : faqs.filter(faq => faq.category === cat).length})
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div key={selectedCategory} className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-200"
              >
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full faq-question-padding text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-100 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded bg-orange-500/10 text-white text-xs font-mono font-bold shrink-0">
                      Q
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div id={`faq-answer-${faq.id}`} className="faq-answer-padding text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 leading-relaxed whitespace-pre-line bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Kakao Customer Support Banner */}
        <div className="panel-padding rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE500] text-[#3C1E1E] hidden sm:flex items-center justify-center font-bold shrink-0">
              <MessageSquare className="w-5 h-5" strokeWidth={3} />
            </div>
            <div>
              <h4 className="heading-item text-white">{faqContent.contact.title}</h4>
              <p className="text-xs text-slate-400">{faqContent.contact.description}</p>
            </div>
          </div>
          <a
            href={faqContent.contact.url}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-black text-xs hover:bg-[#FADA0A] transition-colors shrink-0"
          >
            {faqContent.contact.label}
          </a>
        </div>

      </div>
    </section>
  );
};
