import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Building2, Sparkles, Image as ImageIcon, MessageCircle, HelpCircle, Phone, Calculator } from "lucide-react";
import logo from "../assets/logoyr.png";
import { formatWhatsAppUrl, TARGET_WHATSAPP_NUMBER, useContactInfo } from "@/lib/api";

const links = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#properties", label: "Properties", icon: Building2 },
  { href: "#calculator", label: "EMI Calculator", icon: Calculator },
  { href: "#why", label: "Why Choose Us", icon: Sparkles },
  { href: "#gallery", label: "Gallery", icon: ImageIcon },
  { href: "#testimonials", label: "Testimonials", icon: MessageCircle },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
  { href: "#contact", label: "Contact", icon: Phone },
];

export default function Navbar() {
  const contact = useContactInfo();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const whatsappUrl = formatWhatsAppUrl(
    "Hello YR Realty! 🏡 I'd like to inquire about properties in Delhi NCR.",
    contact.whatsapp || TARGET_WHATSAPP_NUMBER
  );

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-neutral-950/95 backdrop-blur-xl border-b border-amber-400/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <img
              src={logo}
              alt="YR Reality Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                YR Reality
              </h1>
              <p className="text-[10px] sm:text-xs tracking-widest text-amber-400 font-bold uppercase">
                Real estate
              </p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-white/85 hover:text-amber-300 hover:bg-white/10 transition-all"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" /> {contact.whatsapp || contact.phones[0]}
            </a>

            <a
              href="#visit"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 text-xs font-bold shadow-[0_6px_20px_rgba(217,180,80,0.35)] hover:shadow-[0_8px_26px_rgba(217,180,80,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Book Site Visit
            </a>

            <button
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-amber-400/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="relative z-[99999]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[99998]"
                  onClick={() => setOpen(false)}
                />
                <motion.aside
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-950 text-white z-[99999] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-l border-amber-400/20 p-6 flex flex-col overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                      <span className="font-display font-extrabold text-lg text-white">YR Reality</span>
                    </div>
                    <button
                      aria-label="Close menu"
                      className="w-10 h-10 grid place-items-center rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    {links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-neutral-200 hover:bg-white/10 active:bg-white/20 transition-colors"
                      >
                        <l.icon className="w-5 h-5 text-amber-400 shrink-0" />
                        <span className="font-semibold text-sm">{l.label}</span>
                      </a>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-emerald-600 text-white font-bold text-sm text-center shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp ({contact.whatsapp || contact.phones[0]})
                    </a>
                    <a
                      href="#visit"
                      onClick={() => setOpen(false)}
                      className="w-full inline-flex items-center justify-center px-4 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-bold shadow-lg text-center"
                    >
                      Book Free Site Visit
                    </a>
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
