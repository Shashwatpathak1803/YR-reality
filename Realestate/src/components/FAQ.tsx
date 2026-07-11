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
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-semibold tracking-wide">
            FAQ
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
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
                  active ? "bg-card border-primary/30 shadow-elegant" : "bg-card border-border/60 shadow-soft"
                }`}
              >
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left p-5"
                >
                  <span className="font-display font-semibold text-base sm:text-lg">{f.q}</span>
                  <span className={`w-9 h-9 grid place-items-center rounded-full transition-transform ${active ? "bg-primary text-primary-foreground rotate-45" : "bg-muted"}`}>
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
                      className="px-5 pb-5 text-muted-foreground"
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
