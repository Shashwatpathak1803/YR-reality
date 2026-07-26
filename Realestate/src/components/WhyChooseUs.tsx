import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Landmark, BadgePercent, Scale, Headphones, CarFront, CheckCircle2 } from "lucide-react";
import { useContactInfo } from "@/lib/api";

const getItems = (phone: string) => [
  {
    icon: ShieldCheck,
    title: "100% Verified Projects",
    desc: "Every plot, villa, and flat is physically inspected and RERA verified before listing.",
    tag: "Verified",
  },
  {
    icon: MapPin,
    title: "Prime Growth Sectors",
    desc: "Located in high-appreciation corridors: Dwarka Expressway, Golf Course Ext, Noida 150.",
    tag: "High ROI",
  },
  {
    icon: Landmark,
    title: "Easy Bank Loan Approvals",
    desc: "Hassle-free home loans with pre-approval assistance from SBI, HDFC, ICICI & Axis Bank.",
    tag: "Pre-Approved",
  },
  {
    icon: BadgePercent,
    title: "Zero Hidden Charges",
    desc: "100% transparent pricing directly from developers with clear cost breakdowns.",
    tag: "Transparent",
  },
  {
    icon: Scale,
    title: "Complete Legal Checks",
    desc: "Thorough verification of registry, land title deeds, and registry clearance documentation.",
    tag: "Legal Assured",
  },
  {
    icon: CarFront,
    title: "Free Site Pick & Drop",
    desc: "Complimentary luxury car pick-up and guided site walkthrough with our senior advisor.",
    tag: "Free Service",
  },
  {
    icon: Headphones,
    title: `Dedicated Advisor (${phone})`,
    desc: "Single point of contact from your initial search to property handover and registration.",
    tag: "24x7 Support",
  },
];

export default function WhyChooseUs() {
  const contact = useContactInfo();
  const items = getItems(contact.whatsapp || contact.phones[0] || "9971405532");
  return (
    <section id="why" className="py-20 sm:py-28 bg-neutral-950 text-white relative overflow-hidden">
      {/* Ambient warm lighting */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-900/20 blur-[150px] pointer-events-none" />

      {/* Blueprint grid texture */}
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
          <div className="inline-flex px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold tracking-widest uppercase">
            THE YR REALTY ADVANTAGE
          </div>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-5xl">
            Why Property Buyers & Investors Choose{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              YR Realty
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
            We simplify your property search with verified listings, direct builder deals, complete legal paperwork assistance, and zero hidden costs.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="relative p-6 rounded-3xl bg-neutral-900 border border-amber-400/20 hover:border-amber-400/70 shadow-lg hover:shadow-[0_15px_40px_rgba(217,180,80,0.18)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 grid place-items-center">
                    <it.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-amber-400/25 text-amber-200 uppercase tracking-wider">
                    {it.tag}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                  {it.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  {it.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Guarantee Assured
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
