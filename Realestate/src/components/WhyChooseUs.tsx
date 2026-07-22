import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Landmark, BadgePercent, Scale, Headphones, CarFront } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Verified Projects",
    desc: "Every property is verified before we recommend it.",
  },
  {
    icon: MapPin,
    title: "Prime Locations",
    desc: "Properties in fast-growing locations with excellent future value.",
  },
  {
    icon: Landmark,
    title: "Loan Assistance",
    desc: "Support in finding suitable home loan options through trusted banking partners.",
  },
  {
    icon: BadgePercent,
    title: "Transparent Pricing",
    desc: "No hidden charges. Honest pricing and complete transparency.",
  },
  {
    icon: Scale,
    title: "Legal Assistance",
    desc: "Professional guidance for documentation and registration.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our team is here to answer your questions throughout your property journey.",
  },
  {
    icon: CarFront,
    title: "Free Site Visits",
    desc: "Schedule a guided visit to explore properties before making your decision.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 sm:py-28 bg-neutral-50 relative overflow-hidden">
      {/* Faint blueprint grid, echoing the hero's texture for continuity */}
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
            WHY CHOOSE YR REALTY
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
  Why Buyers Choose{" "}
  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
    YR Realty
  </span>
</h2>
<p className="mt-5 text-neutral-600 text-lg leading-8 max-w-3xl mx-auto">
  We help buyers and investors discover verified properties across Delhi NCR with transparent pricing, legal guidance, and dedicated support from enquiry to registration.
</p>
          {/* Signature hairline, matching the hero's measured-line motif */}
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="relative p-6 rounded-3xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-neutral-200/70 overflow-hidden group hover:border-amber-300/60 hover:shadow-[0_12px_36px_rgba(217,180,80,0.18)] transition-all duration-300"
            >
              {/* Gold top accent line, revealed on hover — ties every card back to the hero's hairline */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-[0.07] group-hover:opacity-[0.14] transition" />

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-amber-400/30 grid place-items-center shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
                <it.icon className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-lg text-neutral-900">{it.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-500">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
