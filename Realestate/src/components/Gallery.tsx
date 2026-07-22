import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGalleryImages } from "@/lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { Swiper as SwiperType } from "swiper";


// masonry rhythm: every 1st and 4th tile in a group of 6 spans two rows
const spanFor = (i: number) => (i % 6 === 0 || i % 6 === 3 ? "row-span-2" : "");

export default function Gallery() {
  const [open, setOpen] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const { data } = useGalleryImages();
  const images = (data ?? []).slice(0, 12);
  const items = images.map((src) => ({ src }));

  // No property images uploaded yet — hide the section instead of showing demo photos
  if (!items.length) return null;
  return (
    <section id="gallery" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Faint blueprint grid, matching every other section */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex px-3 py-1 rounded-full border border-amber-300/50 bg-amber-50 text-amber-800 text-xs font-semibold tracking-[0.15em]">
            PREMIUM PROJECTS
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
  Explore Our{" "}
  <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
    Featured Properties
  </span>
</h2>
<div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
<p className="mt-5 text-neutral-500 text-lg max-w-3xl mx-auto leading-8">
  Browse premium residential plots, luxury villas, apartments, and commercial
  projects carefully selected by our experts across Delhi NCR.
</p>
        </motion.div>

<Swiper
  grabCursor
  allowTouchMove={true}
  modules={[Pagination, Autoplay]}
  onSwiper={(swiper) => {
  swiperRef.current = swiper;
  }}
  spaceBetween={24}
  pagination={{ clickable: true }}
  autoplay={{
    delay: 3500,
    disableOnInteraction: false,
  }}
  loop={items.length > 4}
  breakpoints={{
    320: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
  }}
  className="pb-14"
>
  {items.map((it, i) => (
    <SwiperSlide key={i}>
      <motion.button
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
        onClick={() => setOpen(it.src)}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
        className="group relative overflow-hidden rounded-3xl bg-white shadow-xl"
      >
        <img
          src={it.src}
          alt="YR Realty Property"
          loading="lazy"
          className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Property Details */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
            YR REALTY
          </p>

          <h3 className="text-2xl font-bold text-white mt-1">
            Verified Property
          </h3>

          <p className="text-white/80 text-sm mt-2">
            Click to view full image
          </p>
        </div>
      </motion.button>
    </SwiperSlide>
  ))}
</Swiper>

<div className="flex justify-center items-center gap-4 mt-8">
  <button
    onClick={() => swiperRef.current?.slidePrev()}
    className="px-6 py-3 rounded-full border border-amber-400 bg-white text-amber-600 font-semibold hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-md"
  >
    ← Previous
  </button>

  <button
    onClick={() => swiperRef.current?.slideNext()}
    className="px-6 py-3 rounded-full bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-all duration-300 shadow-md"
  >
    Next →
  </button>
</div>
                <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-lg text-neutral-500">
            Like what you see? Schedule a free site visit today and explore these properties in person.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-neutral-950/85 backdrop-blur-md grid place-items-center p-4"
            onClick={() => setOpen(null)}
          >
            <button
              aria-label="Close"
              className="absolute top-6 right-6 w-11 h-11 grid place-items-center rounded-full border border-amber-400/30 bg-white/10 backdrop-blur-md text-amber-300 hover:bg-white/20 transition-colors"
              onClick={() => setOpen(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={open}
              alt="YR Realty Property"
              className="max-h-[85vh] max-w-[92vw] rounded-2xl border border-amber-400/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
