import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, ArrowUp } from "lucide-react";
import { useContactInfo, trackContactClick } from "@/lib/api";

export default function FloatingButtons() {
  const contact = useContactInfo();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phone = contact.phones[0];
  const whatsappHref = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello Please share the detail of this project")}`
    : undefined;

  return (
    <>
      {/* Floating side stack (desktop + mobile above sticky bar) */}
      <div className="fixed right-4 bottom-24 sm:bottom-6 z-40 flex flex-col gap-3">
        <a
          href={whatsappHref}
          aria-label="WhatsApp"
          target="_blank"
          rel="noreferrer"
          onClick={() => trackContactClick("whatsapp")}
          className="w-12 h-12 grid place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <a
          href={`tel:${phone}`}
          aria-label="Call"
          onClick={() => trackContactClick("call")}
          className="w-12 h-12 grid place-items-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-neutral-900 shadow-[0_8px_24px_rgba(217,180,80,0.4)] hover:scale-110 transition-transform"
        >
          <Phone className="w-5 h-5" />
        </a>
        <AnimatePresence>
          {show && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="w-12 h-12 grid place-items-center rounded-full bg-neutral-900 border border-amber-400/30 text-amber-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom bar (mobile) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-amber-200/50 px-3 py-2 flex gap-2">
        <a
          href={`tel:${phone}`}
          onClick={() => trackContactClick("call")}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 text-sm font-semibold shadow-[0_6px_18px_rgba(217,180,80,0.3)]"
        >
          <Phone className="w-4 h-4" /> Call Now
        </a>
        <a
          href="#visit"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full bg-neutral-900 border border-amber-400/30 text-amber-300 text-sm font-semibold"
        >
          Book Visit
        </a>
      </div>
    </>
  );
}
