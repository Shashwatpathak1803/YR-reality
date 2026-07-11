import { motion } from "framer-motion";
import { Search, CalendarCheck, FileCheck2, CreditCard, ClipboardSignature, KeyRound } from "lucide-react";

const steps = [
  { icon: Search, title: "Select Property", desc: "Browse verified listings and shortlist." },
  { icon: CalendarCheck, title: "Schedule Visit", desc: "Pick a slot, we'll arrange the visit." },
  { icon: FileCheck2, title: "Verify Documents", desc: "Legal team validates every document." },
  { icon: CreditCard, title: "Make Payment", desc: "Flexible EMI and loan plans." },
  { icon: ClipboardSignature, title: "Registration", desc: "Hassle-free sale deed registration." },
  { icon: KeyRound, title: "Get Possession", desc: "Keys in hand. Welcome home." },
];

export default function Process() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-semibold tracking-wide">
            SIMPLE PROCESS
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            From search to <span className="text-gradient">possession</span>
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative text-center"
            >
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-card shadow-elegant border border-border/60 grid place-items-center">
                <s.icon className="w-7 h-7 text-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold grid place-items-center shadow-soft">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
