import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGalleryImages } from "@/lib/api";

// masonry rhythm: every 1st and 4th tile in a group of 6 spans two rows
const spanFor = (i: number) => (i % 6 === 0 || i % 6 === 3 ? "row-span-2" : "");

export default function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  const { data } = useGalleryImages();
  const images = (data ?? []).slice(0, 12);
  const items = images.map((src, i) => ({ src, span: spanFor(i) }));

  // No property images uploaded yet — hide the section instead of showing demo photos
  if (!items.length) return null;
  return (
    <section id="gallery" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            GALLERY
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            Moments from our <span className="text-gradient">projects</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {items.map((it, i) => (
            <motion.button
              key={i}
              onClick={() => setOpen(it.src)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`group relative rounded-2xl overflow-hidden shadow-soft ${it.span}`}
            >
              <img
                src={it.src}
                alt="Gallery"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground/80 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(null)}
          >
            <button
              aria-label="Close"
              className="absolute top-6 right-6 w-11 h-11 grid place-items-center rounded-full glass text-white"
              onClick={() => setOpen(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={open}
              alt="Preview"
              className="max-h-[85vh] max-w-[92vw] rounded-2xl shadow-elegant"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
