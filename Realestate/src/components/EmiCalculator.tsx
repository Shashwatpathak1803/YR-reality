import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { Calculator, IndianRupee, Percent, Calendar, ShieldCheck, ArrowRight, TrendingUp, AlertCircle, Info, Sparkles } from "lucide-react";

export function formatInr(val: number): string {
  if (isNaN(val) || !isFinite(val) || val <= 0) return "₹0";
  if (val >= 10000000) {
    const cr = val / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    const l = val / 100000;
    return `₹${l.toFixed(2)} Lakh`;
  }
  return `₹${Math.round(val).toLocaleString("en-IN")}`;
}

export function formatExactInr(val: number): string {
  if (isNaN(val) || !isFinite(val) || val <= 0) return "₹0";
  return `₹${Math.round(val).toLocaleString("en-IN")}`;
}

export default function EmiCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(8000000); // 80 Lakh default
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [prefilledTitle, setPrefilledTitle] = useState<string>("");

  // Listen for pre-fill events from PropertyCards
  useEffect(() => {
    const handlePreFill = (e: Event) => {
      const customEvent = e as CustomEvent<{ price?: number; title?: string }>;
      if (customEvent.detail?.price && customEvent.detail.price > 0) {
        setPropertyPrice(customEvent.detail.price);
        if (customEvent.detail.title) {
          setPrefilledTitle(customEvent.detail.title);
        }
      }
    };

    window.addEventListener("yr:calculate-emi", handlePreFill);
    return () => window.removeEventListener("yr:calculate-emi", handlePreFill);
  }, []);

  // Calculated values
  const safePrice = Math.max(0, propertyPrice || 0);
  const downPaymentAmount = Math.round((safePrice * Math.min(100, Math.max(0, downPaymentPercent))) / 100);
  const principalLoan = Math.max(0, safePrice - downPaymentAmount);

  // EMI Calculation using standard banking formula
  const monthlyRate = (interestRate || 0) / 12 / 100;
  const totalMonths = Math.max(1, (tenureYears || 1) * 12);

  let monthlyEmi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (principalLoan > 0) {
    if (monthlyRate === 0) {
      monthlyEmi = principalLoan / totalMonths;
      totalInterest = 0;
      totalPayment = principalLoan;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEmi = Math.round((principalLoan * monthlyRate * factor) / (factor - 1));
      totalPayment = monthlyEmi * totalMonths;
      totalInterest = Math.max(0, totalPayment - principalLoan);
    }
  }

  const grandTotal = totalPayment + downPaymentAmount;

  // Percentage shares for visual chart
  const principalShare = grandTotal > 0 ? Math.round((principalLoan / grandTotal) * 100) : 0;
  const interestShare = grandTotal > 0 ? Math.round((totalInterest / grandTotal) * 100) : 0;
  const downPaymentShare = grandTotal > 0 ? Math.max(0, 100 - principalShare - interestShare) : 0;

  const priceId = useId();
  const dpId = useId();
  const tenureId = useId();
  const rateId = useId();

  return (
    <section id="calculator" className="py-20 sm:py-28 relative overflow-hidden bg-neutral-900 text-white">
      {/* Blueprint Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-bold tracking-widest uppercase">
            <Calculator className="w-3.5 h-3.5 text-amber-400" /> Automated Financial Tools
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl leading-tight text-white">
            Automated{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              EMI & Loan Calculator
            </span>
          </h2>
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-4" />
          <p className="mt-4 text-neutral-400 text-sm sm:text-base">
            Adjust loan parameters below to automatically compute your monthly installment, interest breakdown, and repayment schedule in real time.
          </p>

          {prefilledTitle && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Showing estimation for: {prefilledTitle}
            </div>
          )}
        </motion.div>

        {/* Main Calculator Layout: Inputs (Left) & Results (Right) */}
        <div className="mt-12 grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Sliders & Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-neutral-950/80 border border-amber-400/20 shadow-2xl backdrop-blur-xl space-y-6 relative"
          >
            {/* Blueprint Corners */}
            <span className="pointer-events-none absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
            <span className="pointer-events-none absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
            <span className="pointer-events-none absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
            <span className="pointer-events-none absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br-md" />

            {/* 1. Property Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={priceId} className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> Property Price
                </label>
                <span className="font-display font-extrabold text-lg text-amber-300">
                  {formatInr(safePrice)}
                </span>
              </div>
              <input
                id={priceId}
                type="range"
                min={500000}
                max={50000000}
                step={100000}
                value={safePrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>₹5 Lakh</span>
                <span>₹2.5 Cr</span>
                <span>₹5.0 Cr</span>
              </div>
            </div>

            {/* 2. Down Payment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={dpId} className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-400" /> Down Payment ({downPaymentPercent}%)
                </label>
                <span className="font-display font-bold text-sm text-neutral-200">
                  {formatInr(downPaymentAmount)}
                </span>
              </div>
              <input
                id={dpId}
                type="range"
                min={0}
                max={90}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>0% (No DP)</span>
                <span>20% (Standard)</span>
                <span>90% (High DP)</span>
              </div>
            </div>

            {/* 3. Loan Tenure */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={tenureId} className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Loan Tenure
                </label>
                <span className="font-display font-bold text-sm text-amber-300">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </span>
              </div>
              <input
                id={tenureId}
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* 4. Interest Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={rateId} className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Interest Rate (% p.a.)
                </label>
                <span className="font-display font-bold text-sm text-amber-300">
                  {interestRate.toFixed(1)}%
                </span>
              </div>
              <input
                id={rateId}
                type="range"
                min={5}
                max={15}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
                <span>5.0%</span>
                <span>8.5% (Typical Bank)</span>
                <span>15.0%</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Automated Calculation Output Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-neutral-950 to-neutral-900 border border-amber-400/40 shadow-[0_20px_60px_rgba(217,180,80,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Calculated Monthly EMI
                  </span>
                  <div id="emi-result-amount" className="font-display font-black text-3xl sm:text-4xl text-amber-300 mt-1">
                    {formatExactInr(monthlyEmi)}
                    <span className="text-sm font-normal text-neutral-400 ml-1">/ month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 grid place-items-center">
                  <Calculator className="w-6 h-6" />
                </div>
              </div>

              {/* Financial Metric Cards Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-neutral-400 block mb-1">Principal Loan (P)</span>
                  <span className="font-bold text-sm text-white">{formatInr(principalLoan)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-neutral-400 block mb-1">Total Interest (I)</span>
                  <span className="font-bold text-sm text-amber-300">{formatInr(totalInterest)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-neutral-400 block mb-1">Down Payment</span>
                  <span className="font-bold text-sm text-white">{formatInr(downPaymentAmount)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
                  <span className="text-neutral-400 block mb-1">Total Amount</span>
                  <span className="font-bold text-sm text-emerald-400">{formatInr(grandTotal)}</span>
                </div>
              </div>

              {/* Ratio Visualizer Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-neutral-400 mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Principal ({principalShare}%)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block" /> Interest ({interestShare}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${principalShare}%` }} className="bg-amber-400 h-full transition-all duration-300" />
                  <div style={{ width: `${interestShare}%` }} className="bg-amber-700 h-full transition-all duration-300" />
                  <div style={{ width: `${downPaymentShare}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Disclaimer & Actions */}
            <div className="mt-8 pt-4 border-t border-neutral-800/80">
              <p className="text-[11px] leading-relaxed text-neutral-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  EMI shown is an estimated calculation and may differ from the actual loan amount offered by a financial institution.
                </span>
              </p>

              <a
                href="#visit"
                className="mt-4 w-full h-12 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 text-neutral-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Book Site Visit & Get Loan Assistance</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
