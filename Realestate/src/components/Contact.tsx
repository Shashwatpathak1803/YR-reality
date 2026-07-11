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
    <section id="contact" className="py-20 sm:py-28 bg-[image:var(--gradient-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            GET IN TOUCH
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl">
            Let's find you a <span className="text-gradient">home</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-3xl p-8 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-elegant relative overflow-hidden"
          >
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10" />
            <div className="absolute -right-10 -bottom-20 w-72 h-72 rounded-full bg-white/5" />
            <h3 className="font-display font-bold text-2xl relative">Contact Information</h3>
            <p className="mt-2 text-primary-foreground/85 text-sm relative">
              Our advisors are ready to help you 7 days a week.
            </p>

            <div className="mt-8 space-y-5 relative">
              <a href={`tel:${contact.phones[0]}`} onClick={() => trackContactClick("call")} className="flex items-start gap-3 group">
                <div className="w-11 h-11 rounded-xl glass-dark grid place-items-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/70">Call us</div>
                  {contact.phones.map((p) => (
                    <div key={p} className="font-semibold group-hover:underline">{p}</div>
                  ))}
                </div>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl glass-dark grid place-items-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/70">Email</div>
                  <div className="font-semibold">{contact.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl glass-dark grid place-items-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-primary-foreground/70">Address</div>
                  <div className="font-semibold">{contact.address}</div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 aspect-video rounded-2xl overflow-hidden border border-white/20">
              <iframe
                title="Map"
                src={contact.googleMap || "https://www.openstreetmap.org/export/embed.html?bbox=76.8%2C28.4%2C77.4%2C28.8&layer=mapnik"}
                className="w-full h-full grayscale"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="lg:col-span-3 rounded-3xl p-8 bg-card border border-border/60 shadow-soft"
          >
            <h3 className="font-display font-bold text-2xl">Send us a message</h3>
            <p className="mt-1 text-sm text-muted-foreground">We'll get back within 24 hours.</p>
            {sent ? (
              <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary text-primary-foreground grid place-items-center text-xl">✓</div>
                <h4 className="mt-3 font-display font-bold text-xl">Message Sent!</h4>
                <p className="mt-1 text-sm text-muted-foreground">
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
                      <span className="text-xs font-semibold text-muted-foreground">Message</span>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you're looking for..."
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </label>
                  </div>
                </div>
                {error && <p className="mt-3 text-xs font-semibold text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition disabled:opacity-70"
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
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full h-11 rounded-xl border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
