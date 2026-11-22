'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const categories = ['General', 'Privacy', 'Setup', 'Billing', 'Local models'] as const;
type Category = (typeof categories)[number];

const faqs: Array<{ category: Category; question: string; answer: string }> = [
  {
    category: 'General',
    question: 'Is VEYRA a chatbot?',
    answer:
      'No. VEYRA is an AI-powered interview system with two focused purposes: live interview assistance and interview practice. It is grounded in your CV and authorised context.',
  },
  {
    category: 'General',
    question: 'Does the interviewer know I am using VEYRA?',
    answer:
      'VEYRA displays guidance in its Desktop workspace. What others can see depends on your desktop window and screen-sharing setup.',
  },
  {
    category: 'Privacy',
    question: 'Is my interview data used to train AI models?',
    answer:
      'Local models process requests on your device. For cloud processing, data handling depends on the provider and the consent settings you choose. Review provider terms before sending sensitive information.',
  },
  {
    category: 'Privacy',
    question: 'Where is my data stored?',
    answer:
      'Your CVs, interview recordings, and private documents are not stored centrally by default. Backup is opt-in with explicit consent.',
  },
  {
    category: 'Setup',
    question: 'Do I need the Desktop app?',
    answer:
      'Yes. Live interview assistance and practice run in the VEYRA Desktop application. This website is the account portal and marketing site.',
  },
  {
    category: 'Setup',
    question: 'Which operating systems are supported?',
    answer:
      'Supported platforms are determined by the Veyra Platform release system. Check the Download page for verified installer availability.',
  },
  {
    category: 'Billing',
    question: 'How is billing handled?',
    answer:
      'Billing and subscriptions are managed by the Veyra Platform. Payment state comes from verified Platform records and webhooks.',
  },
  {
    category: 'Privacy',
    question: 'Can I delete my account?',
    answer: 'Account deletion and data export are available through your account settings.',
  },
  {
    category: 'Local models',
    question: 'Can my computer run local models?',
    answer:
      'The Desktop app checks your hardware and available runtimes before showing model recommendations. Requirements vary by model, and a model may not be compatible with your device.',
  },
];

export function FAQContent() {
  const [category, setCategory] = useState<Category>('General');
  const [query, setQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0]?.question ?? null);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  const visibleFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          faq.category === category &&
          (!normalizedQuery ||
            faq.question.toLocaleLowerCase().includes(normalizedQuery) ||
            faq.answer.toLocaleLowerCase().includes(normalizedQuery)),
      ),
    [category, normalizedQuery],
  );
  const expandedQuestion =
    openQuestion === null
      ? null
      : visibleFaqs.some((faq) => faq.question === openQuestion)
        ? openQuestion
        : (visibleFaqs[0]?.question ?? null);
  const selectCategory = (nextCategory: Category) => {
    setCategory(nextCategory);
    const firstMatch = faqs.find(
      (faq) =>
        faq.category === nextCategory &&
        (!normalizedQuery ||
          faq.question.toLocaleLowerCase().includes(normalizedQuery) ||
          faq.answer.toLocaleLowerCase().includes(normalizedQuery)),
    );
    setOpenQuestion(firstMatch?.question ?? null);
  };

  return (
    <div className="mx-auto max-w-[820px]">
      <label className="sr-only" htmlFor="faq-search">
        Search frequently asked questions
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions..."
          className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div
        aria-label="FAQ categories"
        className="mt-5 flex flex-wrap gap-2"
        role="tablist"
      >
        {categories.map((item) => {
          const selected = category === item;
          return (
            <button
              key={item}
              id={`faq-tab-${item.toLowerCase().replaceAll(' ', '-')}`}
              aria-controls="faq-results"
              aria-selected={selected}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selected
                  ? 'border-veyra-indigo bg-veyra-indigo text-white'
                  : 'border-border bg-card text-foreground hover:bg-secondary'
              }`}
              onClick={() => selectCategory(item)}
              role="tab"
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>

      <div
        id="faq-results"
        aria-live="polite"
        aria-labelledby={`faq-tab-${category.toLowerCase().replaceAll(' ', '-')}`}
        className="mt-4 space-y-3"
        role="tabpanel"
      >
        {visibleFaqs.length > 0 ? (
          visibleFaqs.map((faq) => {
            const expanded = expandedQuestion === faq.question;
            const answerId = `faq-answer-${faqs.indexOf(faq)}`;
            return (
              <article
                key={faq.question}
                className={`overflow-hidden rounded-xl border bg-card transition-colors ${
                  expanded ? 'border-veyra-indigo/40' : 'border-border'
                }`}
              >
                <h2>
                  <button
                    aria-controls={answerId}
                    aria-expanded={expanded}
                    className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-veyra-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    onClick={() =>
                      setOpenQuestion((current) =>
                        current === faq.question ? null : faq.question,
                      )
                    }
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-veyra-indigo transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h2>
                {expanded && (
                  <div
                    id={answerId}
                    className="px-5 pb-5 text-sm leading-6 text-muted-foreground"
                  >
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })
        ) : (
          <p
            className="rounded-xl border border-dashed border-border bg-secondary/40 px-5 py-8 text-center text-sm text-muted-foreground"
            role="status"
          >
            No questions found. Try another search or category.
          </p>
        )}
      </div>
    </div>
  );
}
