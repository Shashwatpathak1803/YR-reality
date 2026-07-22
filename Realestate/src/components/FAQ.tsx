import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { type FAQ as FaqItem } from "@/data/faq";
import { useFaqs } from "@/lib/api";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const { data } = useFaqs();
  const faqs: FaqItem[] = (data ?? []).map((f) => ({ q: f.question, a: f.answer }));

  // No FAQs added in the admin panel yet — hide the section instead of showing demo content
  if (!faqs.length) return null;
  return (
    <section id="faq" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Faint blueprint grid, matching every other section */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full border border-amber-300/50 bg-amber-50 text-amber-800 text-xs font-semibold tracking-[0.15em]">
            FAQ
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const active = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  active
                    ? "bg-white border-amber-300/60 shadow-[0_12px_36px_rgba(217,180,80,0.15)]"
                    : "bg-white border-amber-100/60 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                }`}
              >
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left p-5"
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-neutral-900">{f.q}</span>
                  <span
                    className={`w-9 h-9 grid place-items-center rounded-full transition-transform shrink-0 ${
                      active
                        ? "bg-gradient-to-br from-amber-300 to-amber-500 text-neutral-900 rotate-45"
                        : "bg-amber-50 text-amber-700 border border-amber-200/60"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-5 pb-5 text-neutral-500"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
