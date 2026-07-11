import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Landmark, BadgePercent, Scale, Headphones, CarFront } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Verified Documents", desc: "Every listing is legally vetted with clear titles." },
  { icon: MapPin, title: "Prime Locations", desc: "Handpicked properties in high-growth corridors." },
  { icon: Landmark, title: "Loan Assistance", desc: "Tie-ups with 20+ leading banks and NBFCs." },
  { icon: BadgePercent, title: "Best Pricing", desc: "Direct developer prices with zero hidden fees." },
  { icon: Scale, title: "Legal Support", desc: "In-house legal team for hassle-free registration." },
  { icon: Headphones, title: "24×7 Support", desc: "Real humans available whenever you need us." },
  { icon: CarFront, title: "Site Visits Available", desc: "Guided visits with pickup on request." },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-20 sm:py-28 bg-[image:var(--gradient-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            WHY CHOOSE US
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            Trusted by <span className="text-gradient">thousands of families</span>
          </h2>
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
              className="relative p-6 rounded-3xl bg-card shadow-soft border border-border/60 overflow-hidden group"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[image:var(--gradient-primary)] opacity-10 group-hover:opacity-20 transition" />
              <div className="w-12 h-12 rounded-2xl bg-[image:var(--gradient-primary)] grid place-items-center shadow-soft">
                <it.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-lg">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
