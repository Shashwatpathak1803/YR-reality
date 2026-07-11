import { motion } from "framer-motion";
import { Home, Building2, Building, Trees, Warehouse, LandPlot, TrendingUp } from "lucide-react";
import { useCategories } from "@/lib/api";

const fallbackCats = [
  { icon: LandPlot, label: "Residential Plots", tone: "from-teal-500 to-emerald-500" },
  { icon: Building2, label: "Commercial Plots", tone: "from-amber-500 to-orange-500" },
  { icon: Building, label: "Luxury Flats", tone: "from-sky-500 to-cyan-500" },
  { icon: Home, label: "Apartments", tone: "from-fuchsia-500 to-pink-500" },
  { icon: Trees, label: "Farm Houses", tone: "from-lime-500 to-green-500" },
  { icon: Warehouse, label: "Villas", tone: "from-indigo-500 to-violet-500" },
  { icon: TrendingUp, label: "Investment", tone: "from-rose-500 to-red-500" },
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
    <section className="py-20 bg-[image:var(--gradient-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-semibold tracking-wide">
            EXPLORE CATEGORIES
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            A property for <span className="text-gradient">every ambition</span>
          </h2>
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
              className="group relative bg-card rounded-2xl p-5 text-center shadow-soft border border-border/60 hover:shadow-elegant transition-all"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${c.tone} grid place-items-center shadow-soft group-hover:scale-110 transition-transform`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{c.label}</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
