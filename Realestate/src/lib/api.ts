/**
 * Backend API client for the public website.
 * All content (properties, testimonials, FAQs, categories, company settings)
 * is served by the Express backend; leads (enquiries, site visits) POST back to it.
 */
import { useQuery } from "@tanstack/react-query";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }
  return body.data as T;
}

// ---------------------------------------------------------------------------
// Types (backend document shapes)
// ---------------------------------------------------------------------------
export interface ApiMedia {
  url?: string;
}
export interface ApiProperty {
  _id: string;
  title: string;
  slug: string;
  category?: { _id: string; name: string; slug: string } | string | null;
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription?: string;
  location: string;
  status?: string;
  featured?: boolean;
  area?: number;
  plotSize?: string;
  images?: ApiMedia[];
}
export interface ApiTestimonial {
  _id: string;
  customerName: string;
  photo?: ApiMedia;
  rating: number;
  review: string;
  location?: string;
  isActive?: boolean;
}
export interface ApiFaq {
  _id: string;
  question: string;
  answer: string;
  isActive?: boolean;
}
export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
}
export interface ApiSettings {
  companyName?: string;
  logo?: ApiMedia;
  address?: string;
  phoneNumbers?: string[];
  email?: string;
  whatsapp?: string;
  googleMap?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo?: { metaTitle?: string; metaDescription?: string };
}

// ---------------------------------------------------------------------------
// Content queries (each falls back gracefully in the components when empty)
// ---------------------------------------------------------------------------
const contentQuery = { staleTime: 60_000, retry: 1 } as const;

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ["featured-properties"],
    queryFn: async () => {
      // Prefer admin-marked featured listings; otherwise show the latest listings
      const featured = await request<ApiProperty[]>("/properties/featured?limit=9");
      if (featured.length) return featured;
      return request<ApiProperty[]>("/properties?limit=9&sort=-createdAt");
    },
    ...contentQuery,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () =>
      (await request<ApiTestimonial[]>("/testimonials?limit=50")).filter(
        (t) => t.isActive !== false,
      ),
    ...contentQuery,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () =>
      (await request<ApiFaq[]>("/faqs?limit=50&sort=order")).filter((f) => f.isActive !== false),
    ...contentQuery,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await request<ApiCategory[]>("/categories?limit=50&sort=order")).filter(
        (c) => c.isActive !== false,
      ),
    ...contentQuery,
  });
}

/** All listings — used to build search options and filter results on the landing page */
export function useAllProperties() {
  return useQuery({
    queryKey: ["all-properties"],
    queryFn: () => request<ApiProperty[]>("/properties?limit=200&sort=-createdAt"),
    ...contentQuery,
  });
}

/** Distinct locations from the admin's actual listings — powers the hero search */
export function usePropertyLocations() {
  const { data } = useAllProperties();
  return [...new Set((data ?? []).map((p) => p.location).filter(Boolean))];
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => request<ApiSettings>("/settings"),
    ...contentQuery,
  });
}

/** Admin gallery uploads + all property images — powers the website gallery */
export function useGalleryImages() {
  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const [media, props] = await Promise.all([
        request<{ url?: string; resourceType?: string }[]>("/media?limit=100&sort=-createdAt").catch(
          () => [],
        ),
        request<ApiProperty[]>("/properties?limit=100&fields=images,title").catch(() => []),
      ]);
      const mediaUrls = media
        .filter((m) => (m.resourceType ?? "image") === "image")
        .map((m) => m.url);
      const propertyUrls = props.flatMap((p) => (p.images ?? []).map((m) => m.url));
      return [...new Set([...mediaUrls, ...propertyUrls].filter(Boolean))] as string[];
    },
    ...contentQuery,
  });
}

// ---------------------------------------------------------------------------
// Contact info helper — backend settings with sensible defaults
// ---------------------------------------------------------------------------
export const DEFAULT_CONTACT = {
  companyName: "YR Realty",
  phones: [] as string[],
  email: "",
  address: "Delhi NCR",
  whatsapp: "",
  socialLinks: {} as NonNullable<ApiSettings["socialLinks"]>,
};

function normalizeContactInfo(data?: ApiSettings) {
  const phones = data?.phoneNumbers?.filter(Boolean) ?? [];
  return {
    companyName: data?.companyName || DEFAULT_CONTACT.companyName,
    phones: phones.length ? phones : DEFAULT_CONTACT.phones,
    email: data?.email || DEFAULT_CONTACT.email,
    address: data?.address || DEFAULT_CONTACT.address,
    whatsapp: (data?.whatsapp || DEFAULT_CONTACT.whatsapp).replace(/[^\d]/g, ""),
    googleMap: data?.googleMap || "",
    socialLinks: data?.socialLinks ?? DEFAULT_CONTACT.socialLinks,
  };
}

export async function getContactInfoSnapshot() {
  try {
    const data = await request<ApiSettings>("/settings");
    return normalizeContactInfo(data);
  } catch {
    return normalizeContactInfo();
  }
}

export function useContactInfo() {
  const { data } = useSettings();
  return normalizeContactInfo(data);
}

// ---------------------------------------------------------------------------
// Lead submissions
// ---------------------------------------------------------------------------
export interface EnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  budget?: string;
  preferredLocation?: string;
  sourcePage?: string;
}

export function submitEnquiry(payload: EnquiryPayload) {
  return request("/enquiries", { method: "POST", body: JSON.stringify(payload) });
}

/**
 * Records a WhatsApp/Call button click as an enquiry so the admin panel can
 * see how many visitors reach out directly. Fire-and-forget (never blocks the
 * actual WhatsApp/dialer opening) and deduped to one per button per session.
 */
export function trackContactClick(kind: "whatsapp" | "call") {
  const key = `tracked-${kind}-click`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const label = kind === "whatsapp" ? "WhatsApp" : "Call";
  submitEnquiry({
    name: `${label} Visitor`,
    phone: "Not shared",
    message: `Visitor clicked the ${label} button on the website.`,
    sourcePage: `${kind}-click`,
  }).catch(() => sessionStorage.removeItem(key));
}

export interface SiteVisitPayload {
  name: string;
  phone: string;
  email?: string;
  preferredDate: string; // ISO date
  preferredTime: string;
  location?: string;
  notes?: string;
}

export function submitSiteVisit(payload: SiteVisitPayload) {
  return request("/site-visits", { method: "POST", body: JSON.stringify(payload) });
}

// price formatting for backend numeric prices
export function formatPrice(price: number): string {
  if (price >= 1e7) return `₹ ${(price / 1e7).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (price >= 1e5) return `₹ ${(price / 1e5).toFixed(0)} Lakh`;
  return `₹ ${price.toLocaleString("en-IN")}`;
}
