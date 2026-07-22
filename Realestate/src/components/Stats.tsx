import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Happy Buyers" },
  { value: 1000, suffix: "+", label: "Property Consultations" },
  { value: 15, suffix: "+", label: "Premium Projects" },
  { value: 100, suffix: "%", label: "Verified Listings" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.8, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, to, mv]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl p-5 text-center bg-white/8 backdrop-blur-xl border border-amber-300/20 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:border-amber-300/40 transition-colors"
        >
          <div className="font-display font-bold text-3xl sm:text-4xl bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent">
            <Counter to={s.value} suffix={s.suffix} />
          </div>
          <div className="mt-1 text-xs sm:text-sm text-white/60 font-medium">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
