import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Building2, Wallet, Search, CheckCircle2, ShieldCheck, Sparkles, Phone, MessageCircle } from "lucide-react";
import { useState, useRef } from "react";
import hero from "@/assets/hero.jpg";
import Stats from "./Stats";
import { formatWhatsAppUrl, TARGET_WHATSAPP_NUMBER, useCategories, useContactInfo, usePropertyLocations } from "@/lib/api";
import { ANY, BUDGETS, useSearchFilter } from "@/lib/search-filter";

const FALLBACK_TYPES = ["Residential Plot", "Commercial Plot", "Villa", "Apartment", "Farm House"];
const FALLBACK_LOCATIONS = ["Delhi NCR", "Gurugram", "Noida", "Faridabad", "Ghaziabad", "Dwarka Expressway"];

const QUICK_SEARCH_CHIPS = ["Gurugram", "Noida", "Delhi NCR", "Faridabad", "Dwarka Expressway"];

export default function Hero() {
  const contact = useContactInfo();
  const { data: categories } = useCategories();
  const projectLocations = usePropertyLocations();
  const { setFilter } = useSearchFilter();

  const types = categories?.length ? categories.map((c) => c.name) : FALLBACK_TYPES;
  const locations = projectLocations.length ? projectLocations : FALLBACK_LOCATIONS;

  const [activeTab, setActiveTab] = useState<string>("All");
  const [type, setType] = useState(ANY);
  const [location, setLocation] = useState(ANY);
  const [budget, setBudget] = useState(ANY);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
    const moveX = (x / rect.width - 0.5) * 15;
    const moveY = (y / rect.height - 0.5) * 15;

    heroRef.current.style.setProperty("--mouse-x", `${moveX}px`);
    heroRef.current.style.setProperty("--mouse-y", `${moveY}px`);
  };

  const onSearch = (overrideType?: string, overrideLoc?: string) => {
    const selectedType = overrideType ?? (activeTab !== "All" ? activeTab : type);
    const selectedLoc = overrideLoc ?? location;
    setFilter({ type: selectedType, location: selectedLoc, budget });
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickLocation = (loc: string) => {
    setLocation(loc);
    onSearch(undefined, loc);
  };

  const directWhatsappUrl = formatWhatsAppUrl(
    "Hello YR Realty! 🏡 I am looking for property options in Delhi NCR / Gurugram. Please guide me.",
    contact.whatsapp || TARGET_WHATSAPP_NUMBER
  );

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      id="home"
      className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 bg-neutral-950"
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(
            500px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(255, 210, 120, 0.14),
            transparent 65%
          )`,
          transition: "background 0.08s linear",
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[650px] h-[650px] rounded-full bg-emerald-900/20 blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Parallax Hero Image / Video */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: [1.04, 1.1, 1.04], opacity: 1 }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
        }}
        className="absolute inset-0 will-change-transform pointer-events-none"
        style={{
          transform: "translate(calc(var(--mouse-x,0px) * 0.2), calc(var(--mouse-y,0px) * 0.2))",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={hero}
          className="w-full h-full object-cover object-center scale-105 opacity-85"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <img src={hero} alt="Luxury Architectural Property" className="w-full h-full object-cover" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-950/40 to-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-neutral-950/50" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading & Trust Badges */}
          <div className="lg:col-span-7 text-white min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex max-w-full flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-md text-amber-200 text-[10px] sm:text-xs font-semibold tracking-wide"
            >
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
              <span className="truncate">100% RERA VERIFIED • ZERO BROKERAGE OPTIONS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-5 font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
            >
              Find Premium Plots & Luxury Homes{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Across Delhi NCR.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-4 sm:mt-5 max-w-2xl text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed"
            >
              Housing portal with direct builder deals, verified title deeds, transparent pricing, and instant WhatsApp support.
            </motion.p>

            {/* Feature Highlights Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-lg min-w-0"
            >
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 text-center min-w-0">
                <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-xs font-semibold block text-white truncate">Title Verified</span>
                <span className="text-[10px] text-white/60 truncate">100% Legal Check</span>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 text-center min-w-0">
                <CalendarDays className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-semibold block text-white truncate">Free Cab Visit</span>
                <span className="text-[10px] text-white/60 leading-tight block mt-0.5 truncate">Pick & Drop Included</span>
              </div>
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 text-center col-span-2 sm:col-span-1 min-w-0">
                <MessageCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-semibold block text-white truncate">WhatsApp Direct</span>
                <span className="text-[10px] text-white/60 truncate">{contact.whatsapp || contact.phones[0]}</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <a
                href="#properties"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 font-bold text-sm shadow-[0_8px_30px_rgba(217,180,80,0.35)] hover:-translate-y-0.5 transition-all max-w-full"
              >
                <span className="truncate">Explore All Projects</span> <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </motion.div>
          </div>

          {/* Right Column: Housing.com Style Multi-Tab Search Widget */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-5 w-full min-w-0"
          >
            <div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl border border-amber-300/60 shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-5 sm:p-6 overflow-hidden">
              
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
                  <Search className="w-5 h-5 text-amber-600" />
                  <span>Property Search</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  Verified Portal
                </span>
              </div>

              {/* Housing Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
                {["All", "Plot", "Villa", "Apartment", "Commercial"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setType(tab === "All" ? ANY : tab);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "bg-neutral-900 text-amber-300 shadow-sm"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {tab === "All" ? "🏡 All Types" : tab}
                  </button>
                ))}
              </div>

              {/* Input Controls */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" /> Property Category
                  </span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value={ANY}>All Property Types</option>
                    {types.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Location / Region
                  </span>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value={ANY}>All Preferred Locations</option>
                    {locations.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-neutral-600 mb-1 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-amber-600" /> Budget Range
                  </span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    <option value={ANY}>Any Budget</option>
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </label>

                {/* Quick Location Pills */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                    🔥 Trending Locations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SEARCH_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleQuickLocation(chip)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all ${
                          location === chip
                            ? "bg-amber-400 text-neutral-950 font-bold"
                            : "bg-neutral-100 text-neutral-700 hover:bg-amber-100"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSearch()}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-bold shadow-[0_8px_24px_rgba(217,180,80,0.35)] hover:shadow-[0_12px_30px_rgba(217,180,80,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Search className="w-4 h-4" /> Search Verified Properties →
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
