import { motion } from "framer-motion";
import { Search, CalendarCheck, FileCheck2, CreditCard, ClipboardSignature, KeyRound, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Shortlist",
    desc: "Filter verified plots, villas & flats by location & budget.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Free Guided Site Visit",
    desc: "Luxury cab pick-up & drop with senior site advisor.",
  },
  {
    step: "03",
    icon: FileCheck2,
    title: "Title & Legal Clearance",
    desc: "Complete document, registry & land verification check.",
  },
  {
    step: "04",
    icon: CreditCard,
    title: "Flexible Financing",
    desc: "Pre-approved bank home loan support at low interest rates.",
  },
  {
    step: "05",
    icon: ClipboardSignature,
    title: "Registry & Agreement",
    desc: "Hassle-free legal registration & paperwork assistance.",
  },
  {
    step: "06",
    icon: KeyRound,
    title: "Instant Key Handover",
    desc: "Own your dream property with 100% peace of mind.",
  },
];

export default function Process() {
  return (
    <section className="py-20 sm:py-28 bg-neutral-50 relative overflow-hidden">
      {/* Blueprint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex px-3.5 py-1.5 rounded-full border border-amber-300/60 bg-amber-50 text-amber-800 text-xs font-bold tracking-widest uppercase">
            6-STEP BUYING PROCESS
          </div>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 leading-tight">
            How You Buy Your Dream Property With{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              YR Realty
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600">
            From shortlisting to final registry, we handle every step seamlessly with full legal clarity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(217,180,80,0.15)] hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-300 grid place-items-center shadow-md">
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="font-display font-extrabold text-2xl text-amber-400/40">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-neutral-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                Step {i + 1} of 6 <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
