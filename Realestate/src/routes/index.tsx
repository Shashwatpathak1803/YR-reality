import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import Categories from "@/components/Categories";
import Gallery from "@/components/Gallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import SiteVisitForm from "@/components/SiteVisitForm";
import SiteVisitPopup from "@/components/SiteVisitPopup";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { DEFAULT_CONTACT, getContactInfoSnapshot } from "@/lib/api";
import { SearchFilterProvider } from "@/lib/search-filter";

export const Route = createFileRoute("/")({
  loader: async () => getContactInfoSnapshot(),
  component: Index,
  head: ({ loaderData }) => {
    const contact = (loaderData ?? DEFAULT_CONTACT) as typeof DEFAULT_CONTACT;
    const phones = (contact.phones ?? []).map((phone) => (phone.startsWith("+") ? phone : `+${phone}`));

    return {
      meta: [
        { title: `${contact.companyName} — Find Your Dream Plot Today` },
        {
          name: "description",
          content: `Verified residential plots, commercial plots, luxury villas, apartments and flats across Delhi NCR. Book a free site visit with ${contact.companyName}.`,
        },
        { property: "og:title", content: `${contact.companyName} — Find Your Dream Plot Today` },
        {
          property: "og:description",
          content: `Premium real estate — plots, villas, flats and commercial spaces. RERA verified. Loan assistance. 24×7 support.`,
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "/" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: contact.companyName },
        {
          name: "twitter:description",
          content: `Verified plots, villas, flats and commercial properties in Delhi NCR.`,
        },
      ],
      links: [
        { rel: "canonical", href: "/" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: contact.companyName,
            description: "Verified residential plots, commercial plots, villas, apartments and flats.",
            telephone: phones,
            email: contact.email,
            areaServed: "Delhi NCR",
            address: { "@type": "PostalAddress", addressLocality: "Delhi NCR", addressCountry: "IN" },
          }),
        },
      ],
    };
  },
});

function Index() {
  return (
    <SearchFilterProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <Categories />
          <FeaturedProperties />
          <WhyChooseUs />
          <Process />
          <Gallery />
          <Testimonials />
          <FAQ />
          <SiteVisitForm />
          <Contact />
        </main>
        <Footer />
        <FloatingButtons />
        <SiteVisitPopup />
      </div>
    </SearchFilterProvider>
  );
}
