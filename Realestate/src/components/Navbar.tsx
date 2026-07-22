import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Building2, Sparkles, Image as ImageIcon, MessageCircle, HelpCircle, Phone } from "lucide-react";
import logo from "../assets/logoyr.png";

const links = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#properties", label: "Properties", icon: Building2 },
  { href: "#why", label: "Why Choose Us", icon: Sparkles },
  { href: "#gallery", label: "Gallery", icon: ImageIcon },
  { href: "#testimonials", label: "Testimonials", icon: MessageCircle },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
  { href: "#contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-amber-200/50 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
   <a href="#home" className="flex items-center gap-3">
  <img
    src={logo}
    alt="YR Reality Logo"
    className="h-12 md:h-14 w-auto object-contain"
  />

  <div>
    <h1 className={`text-xl font-bold transition-colors duration-300 ${scrolled ? "text-neutral-900" : "text-white"}`}>
      YR Reality
    </h1>
    <p className={`text-xs tracking-widest transition-colors duration-300 ${scrolled ? "text-amber-700/70" : "text-amber-200/70"}`}>
      REAL ESTATE
    </p>
  </div>
</a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                scrolled
                  ? "text-neutral-700 hover:text-amber-700 hover:bg-amber-50"
                  : "text-white/85 hover:text-amber-200 hover:bg-white/10"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#visit"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 text-sm font-semibold shadow-[0_6px_20px_rgba(217,180,80,0.3)] hover:shadow-[0_8px_26px_rgba(217,180,80,0.45)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Site Visit
          </a>
          <button
            aria-label="Open menu"
            className={`lg:hidden w-10 h-10 grid place-items-center rounded-lg border transition-colors duration-300 ${
              scrolled
                ? "border-amber-200/60 bg-amber-50 text-neutral-900"
                : "border-white/20 bg-white/10 text-white backdrop-blur-md"
            }`}
            onClick={() => setOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[82%] max-w-sm bg-white z-50 shadow-[0_0_60px_rgba(0,0,0,0.25)] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="font-display font-bold text-lg text-neutral-900">Menu</div>
                <button
                  aria-label="Close menu"
                  className="w-10 h-10 grid place-items-center rounded-lg bg-amber-50 border border-amber-200/60 text-neutral-900"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-amber-50 transition-colors"
                  >
                    <l.icon className="w-5 h-5 text-amber-500" />
                    <span className="font-medium">{l.label}</span>
                  </a>
                ))}
              </div>
              <a
                href="#visit"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center px-4 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 font-semibold shadow-[0_8px_24px_rgba(217,180,80,0.3)]"
              >
                Book Site Visit
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
