import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";
import { useContactInfo, trackContactClick, formatWhatsAppUrl, TARGET_WHATSAPP_NUMBER } from "@/lib/api";

export default function FloatingButtons() {
  const contact = useContactInfo();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = contact.phones[0] || "+91 99714 05532";
  const whatsappUrl = formatWhatsAppUrl(
    "Hello YR Realty! 🏡 Please share details about your available properties and site visit availability.",
    contact.whatsapp || TARGET_WHATSAPP_NUMBER
  );

  return (
    <>
      {/* Floating Action Buttons (Right side - Desktop & Tablet only) */}
      <div className="hidden sm:flex fixed right-5 bottom-24 z-40 flex-col gap-3">
        {/* WhatsApp Floating Button */}
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContactClick("whatsapp")}
          aria-label="Contact on WhatsApp"
          className="w-13 h-13 sm:w-14 sm:h-14 grid place-items-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_10px_25px_rgba(16,185,129,0.45)] hover:scale-110 transition-all duration-300 relative group"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute right-16 bg-neutral-900 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border border-amber-400/30 pointer-events-none">
            WhatsApp ({contact.whatsapp})
          </span>
        </motion.a>

        {/* Back to Top */}
        <AnimatePresence>
          {show && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="w-11 h-11 mx-auto grid place-items-center rounded-full bg-neutral-900 border border-amber-400/40 text-amber-300 shadow-lg hover:scale-110 transition-transform"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-amber-400/25 px-3 py-2.5 flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContactClick("whatsapp")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>

        <a
          href={`tel:${phone}`}
          onClick={() => trackContactClick("call")}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 text-xs font-bold shadow-md active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4" /> Call Us
        </a>

        <a
          href="#visit"
          className="inline-flex items-center justify-center px-3.5 h-11 rounded-xl bg-neutral-800 text-amber-300 text-xs font-bold border border-amber-400/30"
        >
          Book Visit
        </a>
      </div>
    </>
  );
}
