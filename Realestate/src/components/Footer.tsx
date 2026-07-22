import { Home, Facebook, Instagram, Youtube, MessageCircle, Twitter, Linkedin } from "lucide-react";
import { useContactInfo } from "@/lib/api";

export default function Footer() {
  const contact = useContactInfo();

  const socials = [
    { icon: Facebook, href: contact.socialLinks.facebook },
    { icon: Instagram, href: contact.socialLinks.instagram },
    { icon: Youtube, href: contact.socialLinks.youtube },
    { icon: Twitter, href: contact.socialLinks.twitter },
    { icon: Linkedin, href: contact.socialLinks.linkedin },
    {
      icon: MessageCircle,
      href: contact.whatsapp
        ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hello Please share the detail of this project")}`
        : undefined,
    },
  ].filter((s) => s.href);

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Faint blueprint grid, matching every other section */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #C9A227 1px, transparent 1px), linear-gradient(to bottom, #C9A227 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 grid place-items-center">
                <Home className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{contact.companyName}</div>
                <div className="text-xs text-amber-200/70 uppercase tracking-widest">Find Your Dream Plot Today</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60 max-w-md">
              Verified residential plots, commercial plots, luxury flats, villas and investment opportunities across Delhi NCR.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Social"
                    className="w-10 h-10 grid place-items-center rounded-full bg-white/5 border border-amber-400/20 hover:bg-gradient-to-br hover:from-amber-300 hover:to-amber-500 hover:border-transparent hover:text-neutral-900 transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="font-display font-semibold mb-4 text-amber-100">Quick Links</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#properties" className="hover:text-amber-300 transition-colors">Properties</a></li>
              <li><a href="#why" className="hover:text-amber-300 transition-colors">About</a></li>
              <li><a href="#faq" className="hover:text-amber-300 transition-colors">FAQ</a></li>
              <li><a href="#visit" className="hover:text-amber-300 transition-colors">Book a Visit</a></li>
              <li><a href="#contact" className="hover:text-amber-300 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="font-display font-semibold mb-4 text-amber-100">Contact</div>
            <ul className="space-y-2 text-sm text-white/60">
              {contact.phones.map((p) => (
                <li key={p}><a href={`tel:${p}`} className="hover:text-amber-300 transition-colors">{p}</a></li>
              ))}
              <li>{contact.email}</li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-amber-400/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} {contact.companyName}. All rights reserved.</div>
          <div>Crafted with care for modern real estate buyers.</div>
        </div>
      </div>
    </footer>
  );
}
