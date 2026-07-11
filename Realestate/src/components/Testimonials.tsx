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
    <section id="testimonials" className="py-20 sm:py-28 bg-[image:var(--gradient-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            TESTIMONIALS
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            Loved by <span className="text-gradient">1000+ families</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-7 rounded-3xl bg-card border border-border/60 shadow-soft hover:shadow-elegant transition"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/15" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 text-foreground/85 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
