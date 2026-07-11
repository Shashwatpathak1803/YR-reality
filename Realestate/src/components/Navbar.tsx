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
        scrolled ? "glass shadow-soft" : "bg-transparent"
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
    <h1 className="text-xl font-bold text-[#ffffff]">
      YR Reality
    </h1>
    <p className="text-xs text-gray-500 tracking-widest">
      REAL ESTATE
    </p>
  </div>
</a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#visit"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition"
          >
            Book Site Visit
          </a>
          <button
            aria-label="Open menu"
            className="lg:hidden w-10 h-10 grid place-items-center rounded-lg glass"
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
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[82%] max-w-sm bg-background z-50 shadow-elegant p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="font-display font-bold text-lg">Menu</div>
                <button
                  aria-label="Close menu"
                  className="w-10 h-10 grid place-items-center rounded-lg bg-muted"
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
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition"
                  >
                    <l.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{l.label}</span>
                  </a>
                ))}
              </div>
              <a
                href="#visit"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center px-4 py-3 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold"
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
