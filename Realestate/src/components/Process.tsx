import { motion } from "framer-motion";
import { Search, CalendarCheck, FileCheck2, CreditCard, ClipboardSignature, KeyRound } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Share Your Requirements",
    desc: "Tell us your preferred location, property type, and budget.",
  },
  {
    icon: CalendarCheck,
    title: "Explore & Visit",
    desc: "Shortlist verified properties and schedule a free site visit.",
  },
  {
    icon: FileCheck2,
    title: "Property Verification",
    desc: "We help verify legal documents and project authenticity.",
  },
  {
    icon: CreditCard,
    title: "Choose The Best Deal",
    desc: "Compare pricing, payment plans, and financing options.",
  },
  {
    icon: ClipboardSignature,
    title: "Registration Support",
    desc: "Complete documentation and registration with expert guidance.",
  },
  {
    icon: KeyRound,
    title: "Own Your Property",
    desc: "Complete your purchase with confidence and peace of mind.",
  },
];

export default function Process() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Faint blueprint grid, matching every other section */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full border border-amber-300/50 bg-amber-50 text-amber-800 text-xs font-semibold tracking-[0.15em]">
            BUYING MADE EASY
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
  Your Journey To{" "}
  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
    Owning The Perfect Property
  </span>
</h2>
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
          <p className="mt-6 max-w-3xl mx-auto text-neutral-600 leading-8">
  From your first enquiry to property registration, our experienced team guides
  you through every step with complete transparency and professional support.
</p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-amber-400/10 via-amber-400/50 to-amber-400/10" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative text-center"
            >
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.18)] border border-amber-400/25 grid place-items-center">
                <s.icon className="w-7 h-7 text-amber-300" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-neutral-900 text-xs font-bold grid place-items-center shadow-[0_4px_12px_rgba(217,180,80,0.4)]">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-4 font-display font-semibold text-neutral-900">{s.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
