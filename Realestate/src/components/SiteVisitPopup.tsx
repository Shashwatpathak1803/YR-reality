import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SiteVisitFormCard } from "./SiteVisitForm";

const INITIAL_DELAY_MS = 30_000; // first popup 30s after landing
const REOPEN_DELAY_MS = 60_000; // reopens 1 min after every dismiss
const BOOKED_KEY = "siteVisitBooked";

/**
 * Timed "Book a Site Visit" popup: opens 30s after page load; if the visitor
 * dismisses it, it comes back every 1 minute until they book. Never shows
 * again (even across visits) once a booking is submitted.
 */
export default function SiteVisitPopup() {
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(BOOKED_KEY) === "1",
  );
  const [delay, setDelay] = useState(INITIAL_DELAY_MS);

  useEffect(() => {
    if (booked || open) return;
    const timer = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(timer);
  }, [booked, open, delay]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setDelay(REOPEN_DELAY_MS);
  };

  const onBooked = () => {
    localStorage.setItem(BOOKED_KEY, "1");
    setBooked(true);
  };

  if (booked && !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto p-0 gap-0 border border-amber-400/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100 [&>button[data-state=open]]:bg-white/20 [&>button[data-state=open]]:text-white">
        {/* Dark charcoal + gold header — matches the on-page "Book a Free Visit" section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 px-6 py-6 sm:px-8 text-white">
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-amber-400/10" />
          {/* Faint blueprint grid, matching every other section */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <DialogHeader className="relative text-left sm:text-left">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full border border-amber-300/30 bg-white/5 text-amber-100 text-[11px] font-semibold tracking-wide">
              <CalendarCheck className="w-3.5 h-3.5 text-amber-300" /> BOOK A FREE VISIT
            </div>
            <DialogTitle className="mt-2 font-display font-bold text-2xl sm:text-3xl leading-tight text-white">
              Visit the property before you invest.
            </DialogTitle>
            <DialogDescription className="text-white/65">
              Guided site visit with our senior advisor — zero pressure, full transparency.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6 sm:px-8 bg-white">
          <SiteVisitFormCard plain onBooked={onBooked} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
