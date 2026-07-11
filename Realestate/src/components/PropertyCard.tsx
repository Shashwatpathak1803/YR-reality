import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Ruler, Phone, ArrowRight, ImageOff } from "lucide-react";
import type { Property } from "@/data/properties";
import { useContactInfo } from "@/lib/api";

export default function PropertyCard({ p, index }: { p: Property; index: number }) {
  const contact = useContactInfo();
  const [i, setI] = useState(0);
  const next = () => setI((v) => (v + 1) % p.images.length);
  const prev = () => setI((v) => (v - 1 + p.images.length) % p.images.length);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06 }}
      className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 border border-border/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {p.images.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <ImageOff className="w-8 h-8" />
              <span className="text-xs font-medium">No image</span>
            </div>
          </div>
        )}
        {p.images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${p.title} - ${idx + 1}`}
            loading="lazy"
            width={1200}
            height={800}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            p.status === "Available" ? "bg-secondary text-secondary-foreground" : "bg-foreground/80 text-white"
          }`}>
            {p.status}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold glass text-foreground">
            {p.propertyType}
          </span>
        </div>

        {p.images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full glass opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full glass opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {p.images.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to image ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-1">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" /> {p.location}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Starting</div>
            <div className="font-display font-bold text-xl text-gradient">{p.price}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground flex items-center gap-1"><Ruler className="w-3 h-3" /> Area</div>
            <div className="text-sm font-semibold">{p.area}</div>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.description}</p>

        <div className="mt-4 flex gap-2">
          <a
            href="#contact"
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground text-sm font-semibold hover:shadow-soft transition"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={`tel:${contact.phones[0]}`}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        </div>
      </div>
    </motion.article>
  );
}
