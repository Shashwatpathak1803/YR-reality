import { motion } from "framer-motion";
import { Home, Building2, Building, Trees, Warehouse, LandPlot, TrendingUp } from "lucide-react";
import { useCategories } from "@/lib/api";

// Tones kept entirely within the gold family (rather than a rainbow per category)
// so this grid stays on-brand instead of looking like a different site's icon set.
const fallbackCats = [
  { icon: LandPlot, label: "Residential Plots", tone: "from-amber-400 to-amber-600" },
  { icon: Building2, label: "Commercial Plots", tone: "from-yellow-500 to-amber-600" },
  { icon: Building, label: "Luxury Flats", tone: "from-amber-300 to-yellow-600" },
  { icon: Home, label: "Apartments", tone: "from-amber-500 to-orange-500" },
  { icon: Trees, label: "Farm Houses", tone: "from-yellow-400 to-amber-500" },
  { icon: Warehouse, label: "Villas", tone: "from-amber-600 to-yellow-700" },
  { icon: TrendingUp, label: "Investment", tone: "from-orange-400 to-amber-600" },
];

const ICONS = [LandPlot, Building2, Building, Home, Trees, Warehouse, TrendingUp];
const TONES = fallbackCats.map((c) => c.tone);

function iconFor(slug: string, i: number) {
  if (slug.includes("plot") || slug.includes("land")) return LandPlot;
  if (slug.includes("commercial") || slug.includes("office")) return Building2;
  if (slug.includes("flat") || slug.includes("apartment")) return Building;
  if (slug.includes("farm")) return Trees;
  if (slug.includes("villa") || slug.includes("house")) return Warehouse;
  if (slug.includes("invest")) return TrendingUp;
  return ICONS[i % ICONS.length];
}

export default function Categories() {
  const { data } = useCategories();
  const cats = (data ?? []).map((c, i) => ({
    icon: iconFor(c.slug, i),
    label: c.name,
    tone: TONES[i % TONES.length],
  }));

  // No categories added in the admin panel yet — hide the section instead of showing demo content
  if (!cats.length) return null;

  return (
    <section className="py-20 bg-neutral-50 relative overflow-hidden">
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
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full border border-amber-300/50 bg-amber-50 text-amber-800 text-xs font-semibold tracking-[0.15em]">
            EXPLORE CATEGORIES
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
            A property for{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              every ambition
            </span>
          </h2>
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {cats.map((c, i) => (
            <motion.a
              key={c.label}
              href="#properties"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-2xl p-5 text-center shadow-[0_4px_16px_rgba(0,0,0,0.05)] border border-amber-100/70 hover:border-amber-300/60 hover:shadow-[0_16px_40px_rgba(217,180,80,0.18)] transition-all"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${c.tone} grid place-items-center shadow-[0_6px_16px_rgba(217,180,80,0.3)] group-hover:scale-110 transition-transform`}>
                <c.icon className="w-6 h-6 text-neutral-900" />
              </div>
              <div className="mt-3 text-sm font-semibold text-neutral-800">{c.label}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
