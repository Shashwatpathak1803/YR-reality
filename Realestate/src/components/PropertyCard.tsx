import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Ruler, Phone, ArrowRight, ImageOff, CheckCircle2, MessageCircle, CalendarCheck, ShieldCheck } from "lucide-react";
import type { Property } from "@/data/properties";
import { formatWhatsAppUrl, TARGET_WHATSAPP_NUMBER, useContactInfo } from "@/lib/api";

export default function PropertyCard({ p, index }: { p: Property; index: number }) {
  const contact = useContactInfo();
  const [i, setI] = useState(0);
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setI((v) => (v + 1) % p.images.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setI((v) => (v - 1 + p.images.length) % p.images.length);
  };

  const whatsappMsg =
    `Hello YR Realty! 🏡 I am interested in *${p.title}* located at *${p.location}* (${p.price}). Please share full details and site visit availability.`;
  const whatsappUrl = formatWhatsAppUrl(whatsappMsg, contact.whatsapp || TARGET_WHATSAPP_NUMBER);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(217,180,80,0.25)] transition-all duration-300 hover:-translate-y-1.5 border border-amber-200/60 hover:border-amber-400 flex flex-col justify-between"
    >
      <div>
        {/* Housing.com style image container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
          {p.images.length === 0 && (
            <div className="absolute inset-0 grid place-items-center text-neutral-400">
              <div className="flex flex-col items-center gap-2">
                <ImageOff className="w-8 h-8 opacity-40" />
                <span className="text-xs font-medium">Image Preview Unavailable</span>
              </div>
            </div>
          )}
          {p.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${p.title} - ${idx + 1}`}
              loading="lazy"
              width={800}
              height={500}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                idx === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-neutral-950/30" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-white" /> RERA VERIFIED
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-neutral-900/80 text-amber-300 backdrop-blur-md border border-amber-400/30">
                {p.propertyType}
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-400 text-neutral-950 shadow-md">
              {p.status}
            </span>
          </div>

          {/* Housing-style Floating Price Badge on Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
            <div className="bg-neutral-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-400/40 shadow-lg">
              <span className="text-[10px] font-medium text-amber-200/80 uppercase tracking-wider block">Price</span>
              <span className="font-display font-extrabold text-lg sm:text-xl text-amber-300">
                {p.price}
              </span>
            </div>
            {p.area && (
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-neutral-900 shadow-md flex items-center gap-1.5 text-xs font-semibold">
                <Ruler className="w-3.5 h-3.5 text-amber-600" /> {p.area}
              </div>
            )}
          </div>

          {/* Image Navigation Arrows */}
          {p.images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full bg-neutral-900/70 hover:bg-neutral-900 backdrop-blur-md border border-amber-400/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-full bg-neutral-900/70 hover:bg-neutral-900 backdrop-blur-md border border-amber-400/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                {p.images.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to image ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setI(idx);
                    }}
                    className={`h-1 rounded-full transition-all ${
                      idx === i ? "w-5 bg-amber-400" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-neutral-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
            {p.title}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="line-clamp-1">{p.location}</span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-neutral-600 line-clamp-2">
            {p.description}
          </p>

          {/* Key Amenities / Housing Specs Bar */}
          <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-[11px] text-neutral-600 font-medium">
            <div className="flex items-center gap-1.5 bg-neutral-50 rounded-xl p-2 border border-neutral-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Title Clear
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-50 rounded-xl p-2 border border-neutral-100">
              <CalendarCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Free Visit
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-50 rounded-xl p-2 border border-neutral-100">
              <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Direct Deal
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar (WhatsApp + Call + Visit) */}
      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>

        <a
          href={`tel:${contact.phones[0] || "+919971405532"}`}
          className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-amber-50 border border-amber-300 text-neutral-900 hover:bg-amber-100 text-xs font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-amber-700" /> Call
        </a>

        <a
          href="#visit"
          className="inline-flex items-center justify-center h-11 px-3.5 rounded-xl bg-neutral-900 text-amber-300 hover:bg-neutral-800 text-xs font-semibold border border-amber-400/30 transition-colors"
        >
          Book Visit <ArrowRight className="w-3 h-3 ml-1" />
        </a>
      </div>
    </motion.article>
  );
}
