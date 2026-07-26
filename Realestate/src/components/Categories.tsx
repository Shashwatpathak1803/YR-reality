import { motion } from "framer-motion";
import { Home, Building2, Building, Trees, Warehouse, LandPlot, TrendingUp, ChevronRight } from "lucide-react";
import { useCategories, useAllProperties } from "@/lib/api";
import { ANY, useSearchFilter } from "@/lib/search-filter";

const fallbackCats = [
  { slug: "residential-plots", name: "Residential Plots", tone: "from-amber-400 to-amber-600", desc: "Approved plots for your dream house" },
  { slug: "commercial-plots", name: "Commercial Plots", tone: "from-yellow-500 to-amber-600", desc: "Prime land for shops & offices" },
  { slug: "luxury-villas", name: "Luxury Villas", tone: "from-amber-500 to-orange-500", desc: "Independent high-end homes" },
  { slug: "apartments", name: "Flats & Apartments", tone: "from-amber-300 to-yellow-600", desc: "2 & 3 BHK modern apartments" },
  { slug: "farm-houses", name: "Farm Houses", tone: "from-yellow-400 to-amber-500", desc: "Green farmhouses & estates" },
  { slug: "investment", name: "High ROI Projects", tone: "from-orange-400 to-amber-600", desc: "Top growth locations in Delhi NCR" },
];

function iconFor(slug: string, i: number) {
  if (slug.includes("plot") || slug.includes("land")) return LandPlot;
  if (slug.includes("commercial") || slug.includes("office")) return Building2;
  if (slug.includes("flat") || slug.includes("apartment")) return Building;
  if (slug.includes("farm")) return Trees;
  if (slug.includes("villa") || slug.includes("house")) return Warehouse;
  return TrendingUp;
}

export default function Categories() {
  const { data: apiCats } = useCategories();
  const { data: allProperties } = useAllProperties();
  const { setFilter } = useSearchFilter();

  const cats = (apiCats?.length ? apiCats : fallbackCats).map((c, i) => {
    const icon = iconFor(c.slug || c.name.toLowerCase(), i);
    const fallback = fallbackCats[i % fallbackCats.length];
    const count = (allProperties ?? []).filter((p) => {
      const catName = p.category && typeof p.category === "object" ? p.category.name : (p.category ?? "");
      const haystack = `${catName} ${p.title} ${p.shortDescription ?? ""} ${p.description ?? ""}`.toLowerCase()
        .replace(/houses/g, "house")
        .replace(/plots/g, "plot")
        .replace(/villas/g, "villa")
        .replace(/apartments/g, "apartment")
        .replace(/flats/g, "flat");

      const normName = (c.name || c.slug || "").toLowerCase()
        .replace(/houses/g, "house")
        .replace(/plots/g, "plot")
        .replace(/villas/g, "villa")
        .replace(/apartments/g, "apartment")
        .replace(/flats/g, "flat");

      const keywords = normName.split(/[\s&,/]+/).filter((w) => w.length > 2 && w !== "and" && w !== "projects" && w !== "high" && w !== "roi");
      return keywords.length > 0 ? keywords.every((kw) => haystack.includes(kw)) : haystack.includes(normName);
    }).length;

    return {
      name: c.name || fallback.name,
      desc: fallback.desc,
      icon,
      tone: fallback.tone,
      count: count > 0 ? `${count}+ Properties` : "Verified Listings",
    };
  });

  const handleSelectCategory = (catName: string) => {
    setFilter({ type: catName, location: ANY, budget: ANY });
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-neutral-900 text-white relative overflow-hidden">
      {/* Blueprint grid background texture */}
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
          <div className="inline-flex px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold tracking-widest uppercase">
            EXPLORE PROPERTY CATEGORIES
          </div>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-5xl">
            Find Exactly What You Are Looking For in{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Delhi NCR
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            Select a category below to instantly filter verified residential plots, luxury villas, commercial land, and apartments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              onClick={() => handleSelectCategory(c.name)}
              className="cursor-pointer group relative bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 rounded-3xl p-6 border border-amber-400/30 hover:border-amber-400/90 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(217,180,80,0.25)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/15 transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.tone} grid place-items-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <c.icon className="w-7 h-7 text-neutral-950" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-amber-300 border border-amber-400/30">
                    {c.count}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-300 transition-colors">
                  {c.name}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Browse Options</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
