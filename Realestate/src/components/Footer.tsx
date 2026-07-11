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
    { icon: MessageCircle, href: contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : undefined },
  ].filter((s) => s.href);

  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[image:var(--gradient-primary)] grid place-items-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display font-bold text-lg">{contact.companyName}</div>
                <div className="text-xs text-background/60 uppercase tracking-widest">Find Your Dream Plot Today</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-background/70 max-w-md">
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
                    className="w-10 h-10 grid place-items-center rounded-full bg-background/10 hover:bg-[image:var(--gradient-primary)] transition"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="font-display font-semibold mb-4">Quick Links</div>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#properties" className="hover:text-background">Properties</a></li>
              <li><a href="#why" className="hover:text-background">About</a></li>
              <li><a href="#faq" className="hover:text-background">FAQ</a></li>
              <li><a href="#visit" className="hover:text-background">Book a Visit</a></li>
              <li><a href="#contact" className="hover:text-background">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="font-display font-semibold mb-4">Contact</div>
            <ul className="space-y-2 text-sm text-background/70">
              {contact.phones.map((p) => (
                <li key={p}><a href={`tel:${p}`} className="hover:text-background">{p}</a></li>
              ))}
              <li>{contact.email}</li>
              <li>{contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-background/60">
          <div>© {new Date().getFullYear()} {contact.companyName}. All rights reserved.</div>
          <div>Crafted with care for modern real estate buyers.</div>
        </div>
      </div>
    </footer>
  );
}
