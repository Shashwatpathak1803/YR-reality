import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  hint?: string;
  tone?: "default" | "gold" | "green" | "info";
  index?: number;
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-primary/5 text-primary",
  gold: "bg-gold/15 text-gold-foreground",
  green: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
};

export function StatCard({ label, value, icon: Icon, delta, hint, tone = "default", index = 0 }: StatCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="card-elevated overflow-hidden group hover:shadow-lg transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-foreground truncate">{value}</p>
              {typeof delta === "number" && (
                <div className="mt-3 flex items-center gap-1.5 text-xs">
                  <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
                    up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(delta)}%
                  </span>
                  {hint && <span className="text-muted-foreground">{hint}</span>}
                </div>
              )}
            </div>
            <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneStyles[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
