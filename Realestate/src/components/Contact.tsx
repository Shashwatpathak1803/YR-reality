import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { submitEnquiry, trackContactClick, useContactInfo } from "@/lib/api";

export default function Contact() {
  const contact = useContactInfo();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Please fill your name and phone number.");
      return;
    }
    setSending(true);
    try {
      await submitEnquiry({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        sourcePage: "contact",
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-neutral-50 relative overflow-hidden">
      {/* Faint blueprint grid, matching the hero and why-choose-us sections */}
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
            GET IN TOUCH
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl text-neutral-900">
            Let's find you a{" "}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              home
            </span>
          </h2>
          <div className="w-16 h-px bg-amber-400/70 mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] relative overflow-hidden border border-amber-400/20"
          >
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-amber-400/10" />
            <div className="absolute -right-10 -bottom-20 w-72 h-72 rounded-full bg-amber-400/5" />
            <h3 className="font-display font-bold text-2xl relative">Contact Information</h3>
            <p className="mt-2 text-white/60 text-sm relative">
              Our advisors are ready to help you 7 days a week.
            </p>

            <div className="mt-8 space-y-5 relative">
 <a
  href="tel:+919876543210"
  onClick={() => trackContactClick("call")}
  className="flex items-start gap-3 group"
>
  <div className="w-11 h-11 rounded-xl bg-white/5 border border-amber-400/25 grid place-items-center group-hover:border-amber-400/50 transition-colors">
    <Phone className="w-5 h-5 text-amber-300" />
  </div>

  <div>
    <div className="text-xs text-white/50">Call us</div>
    <div className="font-semibold group-hover:text-amber-300 group-hover:underline transition-colors">
      +91 99714 05532
    </div>
  </div>
</a>
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=yrrealty9123@gmail.com&su=Property%20Enquiry"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-start gap-3 group"
>
  <div className="w-11 h-11 rounded-xl bg-white/5 border border-amber-400/25 grid place-items-center group-hover:border-amber-400/50 transition-colors">
    <Mail className="w-5 h-5 text-amber-300" />
  </div>

  <div>
    <div className="text-xs text-white/50">Email</div>
    <div className="font-semibold group-hover:text-amber-300 group-hover:underline transition-colors">
      yrrealty9123@gmail.com
    </div>
  </div>
</a>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-amber-400/25 grid place-items-center">
                  <MapPin className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs text-white/50">Address</div>
                  <div className="font-semibold">{contact.address}</div>
                </div>
              </div>
            </div>

            {/* <div className="relative mt-8 aspect-video rounded-2xl overflow-hidden border border-amber-400/20">
              <iframe
                title="Map"
                src={contact.googleMap || "https://www.openstreetmap.org/export/embed.html?bbox=76.8%2C28.4%2C77.4%2C28.8&layer=mapnik"}
                className="w-full h-full grayscale"
                loading="lazy"
              />
            </div> */}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="lg:col-span-3 rounded-3xl p-8 bg-white border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          >
            <h3 className="font-display font-bold text-2xl text-neutral-900">Send us a message</h3>
            <p className="mt-1 text-sm text-neutral-500">We'll get back within 24 hours.</p>
            {sent ? (
              <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-neutral-900 border border-amber-400/40 text-amber-300 grid place-items-center text-xl">✓</div>
                <h4 className="mt-3 font-display font-bold text-xl text-neutral-900">Message Sent!</h4>
                <p className="mt-1 text-sm text-neutral-500">
                  Thank you {name.split(" ")[0]}! Our team will reach out to you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <Field label="Name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Field label="Phone" placeholder="+91 ..." type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  <div className="sm:col-span-2">
                    <Field label="Email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="text-xs font-semibold text-neutral-500">Message</span>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you're looking for..."
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
                      />
                    </label>
                  </div>
                </div>
                {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-900 font-semibold shadow-[0_8px_24px_rgba(217,180,80,0.3)] hover:shadow-[0_12px_32px_rgba(217,180,80,0.45)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {sending ? "Sending…" : "Send Message"}
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300"
      />
    </label>
  );
}
