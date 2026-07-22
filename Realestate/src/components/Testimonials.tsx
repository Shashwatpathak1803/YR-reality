import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials as fallbackTestimonials, type Testimonial } from "@/data/testimonials";
import { useTestimonials } from "@/lib/api";

export default function Testimonials() {
  const { data } = useTestimonials();
  const testimonials: Testimonial[] = (data ?? []).map((t, i) => ({
    id: t._id,
    name: t.customerName,
    role: t.location ?? "",
    avatar: t.photo?.url || fallbackTestimonials[i % fallbackTestimonials.length].avatar,
    rating: t.rating,
    quote: t.review,
  }));

  // No testimonials added in the admin panel yet — hide the section instead of showing demo content
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-neutral-50 relative overflow-hidden">
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
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full border border-amber-300/50 bg-amber-50 text-amber-800 text-xs font-semibold tracking-[0.15em]">
            CLIENT EXPERIENCES
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
  What Our <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">Clients Say</span>
</h2>
<div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
<p className="mt-5 text-neutral-500 text-lg leading-8 max-w-3xl mx-auto">
  Every successful property purchase begins with trust. Here's what our clients
  have to say about their experience with YR Realty.
</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-7 rounded-3xl bg-white border border-amber-200/40 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(217,180,80,0.15)] hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-3xl" />
              <Quote className="absolute top-5 right-5 w-10 h-10 text-amber-400/20" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-5 text-neutral-600 leading-8 italic">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/50"
                />
                <div>
                  <div className="font-bold text-neutral-900">{t.name}</div>
                  <div className="text-sm text-neutral-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
