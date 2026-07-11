import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Building2, Wallet, Search } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import Stats from "./Stats";
import { useCategories, usePropertyLocations } from "@/lib/api";
import { ANY, BUDGETS, useSearchFilter } from "@/lib/search-filter";

const FALLBACK_TYPES = ["Residential Plot", "Commercial Plot", "Villa", "Apartment", "Farm House"];
const FALLBACK_LOCATIONS = ["Delhi NCR", "Gurugram", "Noida", "Faridabad", "Ghaziabad"];

export default function Hero() {
  const { data: categories } = useCategories();
  const projectLocations = usePropertyLocations();
  const { setFilter } = useSearchFilter();

  // Options come from the admin panel's real projects; static lists are only a fallback
  const types = categories?.length ? categories.map((c) => c.name) : FALLBACK_TYPES;
  const locations = projectLocations.length ? projectLocations : FALLBACK_LOCATIONS;

  const [type, setType] = useState(ANY);
  const [location, setLocation] = useState(ANY);
  const [budget, setBudget] = useState(ANY);

  const onSearch = () => {
    setFilter({ type, location, budget });
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Parallax hero image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={hero}
          alt="Premium residential plots at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-white text-xs font-semibold tracking-wide"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              RERA VERIFIED · TRUSTED SINCE 2010
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-5 font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight"
            >
              Invest Today,
              <br />
              <span className="bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
                Build Tomorrow.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed"
            >
              We provide verified residential plots, commercial plots, luxury flats, villas and
              investment opportunities at the best locations across Delhi NCR.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="#properties"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-primary font-semibold shadow-elegant hover:-translate-y-0.5 transition"
              >
                View Properties <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#visit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass text-white font-semibold hover:bg-white/25 transition"
              >
                <CalendarDays className="w-4 h-4" /> Book Site Visit
              </a>
            </motion.div>
          </div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="glass rounded-3xl p-6 sm:p-7 shadow-elegant">
              <div className="text-sm font-semibold text-foreground/90 mb-4">Find Your Dream Property</div>
              <div className="grid grid-cols-1 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Property Type</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-white/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value={ANY}>All Types</option>
                    {types.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-white/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value={ANY}>All Locations</option>
                    {locations.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Budget</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-white/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value={ANY}>Any Budget</option>
                    {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
                <button
                  onClick={onSearch}
                  className="mt-2 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition"
                >
                  <Search className="w-4 h-4" /> Search Properties
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <Stats />
      </div>
    </section>
  );
}
