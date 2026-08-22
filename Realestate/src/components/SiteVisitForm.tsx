import { motion } from "framer-motion";
import { CalendarCheck, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { formatWhatsAppUrl, submitSiteVisit, TARGET_WHATSAPP_NUMBER, useContactInfo } from "@/lib/api";
import { BUDGETS } from "@/lib/search-filter";

function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

function cleanIndianPhone(val: string): string {
  let digits = val.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * The booking form — reused by the page section and the timed popup.
 * `plain` drops the glass card chrome for embedding inside a dialog.
 */
export function SiteVisitFormCard({ onBooked, plain = false }: { onBooked?: () => void; plain?: boolean }) {
  const contact = useContactInfo();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [waUrl, setWaUrl] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(() => getTomorrowDateString());
  const [budget, setBudget] = useState(BUDGETS[0]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanedPhone = cleanIndianPhone(phone);
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const finalDate = date || getTomorrowDateString();
    setSending(true);

    const waText =
      `🚗 *New Site Visit Booking - YR Realty*\n\n` +
      `👤 *Name:* ${name.trim()}\n` +
      `📞 *Phone:* ${cleanedPhone}\n` +
      (location.trim() ? `📍 *Preferred Location:* ${location.trim()}\n` : "") +
      `📅 *Preferred Date:* ${finalDate}\n` +
      `💰 *Budget:* ${budget}`;

    const generatedWaUrl = formatWhatsAppUrl(waText, contact.whatsapp || TARGET_WHATSAPP_NUMBER);
    setWaUrl(generatedWaUrl);

    try {
      await submitSiteVisit({
        name: name.trim(),
        phone: cleanedPhone,
        preferredDate: finalDate,
        preferredTime: "Flexible / Morning",
        location: location.trim() || undefined,
        notes: `Budget: ${budget}`,
      });
      setSent(true);
      onBooked?.();
      window.open(generatedWaUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      // If backend network error or cold-start, still mark sent and open WhatsApp so lead is never lost
      setSent(true);
      onBooked?.();
      window.open(generatedWaUrl, "_blank", "noopener,noreferrer");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className={plain ? "py-6 text-center" : "rounded-3xl p-8 sm:p-10 bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-center"}>
        <div className="w-14 h-14 mx-auto rounded-full bg-neutral-900 border border-amber-400/40 text-amber-300 grid place-items-center text-2xl">✓</div>
        <h3 className="mt-4 font-display font-bold text-2xl text-neutral-900">Visit Scheduled!</h3>
        <p className="mt-2 text-sm text-neutral-500">
          Thank you {name.split(" ")[0]}! Our advisor will call you on {phone} to confirm your visit.
        </p>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Confirm via WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={
        plain
          ? ""
          : "relative rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      }
    >
      {!plain && (
        <>
          {/* Blueprint-style corner brackets — matches the hero search card's signature detail */}
          <span className="pointer-events-none absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
          <span className="pointer-events-none absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
          <span className="pointer-events-none absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
          <span className="pointer-events-none absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br-md" />
        </>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <F label="Name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <F
          label="Phone"
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
        <F label="Preferred Location" placeholder="Gurugram / Noida ..." value={location} onChange={(e) => setLocation(e.target.value)} />
        <F label="Preferred Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().slice(0, 10)} />
        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold text-neutral-500">Budget</span>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1.5 w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
          >
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
      <button
        type="button"
        onClick={onSubmit}
        disabled={sending}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 font-semibold shadow-[0_8px_24px_rgba(217,180,80,0.3)] hover:shadow-[0_12px_32px_rgba(217,180,80,0.45)] transition-all duration-300 disabled:opacity-70"
      >
        {sending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>) : (<>Book Site Visit <ArrowRight className="w-4 h-4" /></>)}
      </button>
    </form>
  );
}

export default function SiteVisitForm() {
  return (
    <section id="visit" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] p-8 sm:p-12 bg-gradient-to-br from-neutral-900 to-neutral-800 border border-amber-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-amber-400/10" />
          <div className="absolute -left-16 -bottom-24 w-72 h-72 rounded-full bg-emerald-900/20 blur-3xl" />
          {/* Faint blueprint grid, matching every other section */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-300/30 bg-white/5 text-amber-100 text-xs font-semibold">
                <CalendarCheck className="w-3.5 h-3.5 text-amber-300" /> BOOK A FREE VISIT
              </div>
              <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl leading-tight">
                Visit the property
                <br />
                before you invest.
              </h2>
              <div className="w-16 h-px bg-amber-400/70 mt-5" />
              <p className="mt-5 text-white/70 max-w-md">
                Guided site visit with our senior advisor. Zero pressure, full transparency, complete document walkthrough.
              </p>
            </div>

            <SiteVisitFormCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function F({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
      />
    </label>
  );
}
