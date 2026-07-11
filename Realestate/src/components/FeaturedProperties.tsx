import { motion } from "framer-motion";
import { type Property } from "@/data/properties";
import { useFeaturedProperties, useAllProperties, formatPrice, type ApiProperty } from "@/lib/api";
import { ANY, BUDGET_RANGES, useSearchFilter } from "@/lib/search-filter";
import PropertyCard from "./PropertyCard";

function mapApiProperty(p: ApiProperty): Property {
  const images = (p.images ?? []).map((m) => m.url).filter(Boolean) as string[];
  return {
    id: p._id,
    title: p.title,
    location: p.location,
    price: formatPrice(p.discountPrice ?? p.price),
    area: p.area ? `${p.area} sq.ft` : (p.plotSize ?? ""),
    propertyType:
      p.category && typeof p.category === "object" ? p.category.name : "Property",
    description: p.shortDescription || p.description,
    images,
    featured: !!p.featured,
    status: p.status === "sold" ? "Sold" : "Available",
  };
}

function matchesFilter(
  p: ApiProperty,
  filter: { type: string; location: string; budget: string },
): boolean {
  if (filter.type !== ANY) {
    const category = p.category && typeof p.category === "object" ? p.category.name : "";
    const haystack = `${category} ${p.title}`.toLowerCase();
    if (!haystack.includes(filter.type.toLowerCase())) return false;
  }
  if (filter.location !== ANY) {
    if (!(p.location ?? "").toLowerCase().includes(filter.location.toLowerCase())) return false;
  }
  if (filter.budget !== ANY && BUDGET_RANGES[filter.budget]) {
    const [min, max] = BUDGET_RANGES[filter.budget];
    const price = p.discountPrice ?? p.price;
    if (price < min || price > max) return false;
  }
  return true;
}

export default function FeaturedProperties() {
  const { filter, setFilter } = useSearchFilter();
  const { data: featured } = useFeaturedProperties();
  const { data: all } = useAllProperties();

  // With an active hero search, filter across ALL projects; otherwise show featured
  const searching = !!filter && (filter.type !== ANY || filter.location !== ANY || filter.budget !== ANY);
  const source = searching ? (all ?? []).filter((p) => matchesFilter(p, filter!)) : (featured ?? []);
  const properties = source.map(mapApiProperty);

  // Nothing in the admin panel yet — hide the section instead of showing demo listings
  if (!properties.length && !searching) return null;

  return (
    <section id="properties" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
            {searching ? "SEARCH RESULTS" : "FEATURED PROPERTIES"}
          </div>
          <h2 className="mt-4 font-display font-bold text-3xl sm:text-5xl leading-tight">
            {searching ? (
              <>
                {properties.length} propert{properties.length === 1 ? "y" : "ies"}{" "}
                <span className="text-gradient">found</span>
              </>
            ) : (
              <>
                Handpicked <span className="text-gradient">premium listings</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-muted-foreground">
            Verified plots, villas, apartments and commercial spaces from trusted developers.
          </p>
          {searching && (
            <button
              onClick={() => setFilter(null)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-input text-sm font-semibold hover:bg-muted transition"
            >
              Clear search
            </button>
          )}
        </motion.div>

        {properties.length ? (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => (
              <PropertyCard key={p.id} p={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            No properties match your search. Try a different type, location or budget.
          </p>
        )}
      </div>
    </section>
  );
}
