import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Building2, Wallet, Search } from "lucide-react";
import { useState, useRef } from "react";
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
  const [mousePosition, setMousePosition] = useState({x: 0,y: 0,});

  const heroRef = useRef<HTMLDivElement>(null);

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!heroRef.current) return;

  const rect = heroRef.current.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  setMousePosition({ x, y });

  const moveX = (x / rect.width - 0.5) * 20;
  const moveY = (y / rect.height - 0.5) * 20;

  heroRef.current.style.setProperty("--mouse-x", `${moveX}px`);
  heroRef.current.style.setProperty("--mouse-y", `${moveY}px`);
};

  const onSearch = () => {
    setFilter({ type, location, budget });
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={heroRef}onMouseMove={handleMouseMove} id="home"className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 bg-neutral-950">
      <div
  className="absolute inset-0 pointer-events-none z-[1]"
  style={{
    background: `radial-gradient(
      450px circle at ${mousePosition.x}px ${mousePosition.y}px,
      rgba(255,210,120,0.12),
      transparent 60%
    )`,
    transition: "background 0.08s linear",
  }}
/>
    {/* Ambient warm gold + deep emerald glow (replaces cyan/purple tech glow) */}

<div className="absolute inset-0 overflow-hidden">

  <div className="absolute -top-32 -left-32 w-[560px] h-[560px] rounded-full bg-amber-500/10 blur-[150px]" />

  <div className="absolute bottom-0 right-0 w-[620px] h-[620px] rounded-full bg-emerald-900/25 blur-[170px]" />

  {/* Faint blueprint grid texture — echoes a property floor plan */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />
  <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-amber-300 animate-pulse opacity-70" />

<div
  className="absolute top-1/3 right-32 w-3 h-3 rounded-full bg-yellow-300 opacity-60 animate-bounce"
  style={{ animationDuration: "5s" }}
/>

<div
  className="absolute bottom-28 left-1/3 w-2 h-2 rounded-full bg-white opacity-60 animate-pulse"
  style={{ animationDuration: "4s" }}
/>

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

</div>
      {/* Parallax hero image */}
<motion.div
  
  initial={{ scale: 1.15, opacity: 0 }}
  animate={{
    scale: [1.05, 1.12, 1.05],
    opacity: 1,
  }}
  transition={{
    opacity: {
      duration: 1.5,
    },
    scale: {
      duration: 20,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  }}
  className="absolute inset-0 will-change-transform"
style={{
  transform:
    "translate(calc(var(--mouse-x,0px) * 0.25), calc(var(--mouse-y,0px) * 0.25))",
}}
>
        <img
          src={hero}
          alt="Premium residential plots at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div
  className="lg:col-span-7 text-white transition-transform duration-300"
  style={{
    transform:
      "translate(var(--mouse-x,0px), var(--mouse-y,0px))",
  }}
>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-300/30 bg-white/5 backdrop-blur-md text-amber-100 text-xs font-semibold tracking-[0.15em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ✓ RERA VERIFIED PROJECTS • TRUSTED PROPERTY CONSULTANTS
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.05] tracking-tight"
            >
             Find Your Dream Property,
            <br />
            <span className="bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent">
             At The Right Price.
            </span>
            </motion.h1>

            {/* Signature hairline — a measured line, like a plot dimension marker */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "4rem" }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="h-px bg-amber-400/60 mt-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 max-w-2xl text-white/75 text-base sm:text-lg leading-relaxed"
            >
              Explore verified plots, premium villas, luxury apartments, and commercial spaces across Delhi NCR.
              Get expert guidance, transparent pricing, legal assistance, and free site visits—all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a
                href="#properties"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 font-semibold shadow-[0_8px_30px_rgba(217,180,80,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(217,180,80,0.5)] transition-all duration-300"
              >
                Explore Projects<ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#visit"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-amber-300/30 text-white font-semibold backdrop-blur-md hover:bg-amber-400/10 hover:border-amber-300/60 transition-all duration-300"
              >
                <CalendarDays className="w-4 h-4" /> Schedule Free Visit
              </a>
            </motion.div>
          </div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-5 transition-transform duration-300"
            style={{transform:"translate(calc(var(--mouse-x,0px) * -0.5), calc(var(--mouse-y,0px) * -0.5))",}}
          >
            <div className="relative rounded-3xl p-6 sm:p-7 bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">

              {/* Blueprint-style corner brackets — the signature detail, echoing a deed/floor plan */}
              <span className="pointer-events-none absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
              <span className="pointer-events-none absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
              <span className="pointer-events-none absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
              <span className="pointer-events-none absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br-md" />

              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700/80 mb-1">
                Curated Selection
              </div>
              <div className="uppercase tracking-[0.2em] text-xs font-semibold text-yellow-500 mb-2">
  VERIFIED PROPERTIES
</div>

<div className="text-2xl font-bold text-foreground mb-5">
  Start Your Property Search
</div>
              <div className="grid grid-cols-1 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Property Type</span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
                  >
                    <option value={ANY}>All Types</option>
                    {types.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location</span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
                  >
                    <option value={ANY}>All Locations</option>
                    {locations.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Budget</span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
                  >
                    <option value={ANY}>Any Budget</option>
                    {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </label>
                <button
                  onClick={onSearch}
                  className="mt-2 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-neutral-900 text-amber-300 font-semibold border border-amber-400/30 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_30px_rgba(217,180,80,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Search className="w-4 h-4" /> Find My Property →
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
