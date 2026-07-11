/**
 * Service layer — real API calls against the Express backend.
 * Backend responses use the ApiResponse envelope; `unwrap` extracts `.data`.
 * Backend documents use `_id` + lowercase enums; mappers convert to UI types.
 */
import { api, unwrap } from "./api";
import type {
  Blog,
  Category,
  Customer,
  CustomerStatus,
  Enquiry,
  EnquiryStatus,
  Faq,
  Offer,
  Property,
  SiteSettings,
  SiteVisit,
  Testimonial,
  VisitStatus,
} from "@/types";

const LIST_LIMIT = 500; // admin lists fetch everything; backend default page size is 10

// Neutral "No image" tile shown for properties without uploaded photos
export const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" font-family="sans-serif" font-size="36" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No image</text></svg>`,
  );

// ---------------------------------------------------------------------------
// Backend document shapes
// ---------------------------------------------------------------------------
interface BMedia {
  url?: string;
  publicId?: string;
}
interface BCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}
interface BProperty {
  _id: string;
  title: string;
  slug: string;
  category?: BCategory | string | null;
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription?: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  status?: string;
  available?: boolean;
  plotSize?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  constructionStatus?: string;
  amenities?: string[];
  images?: BMedia[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  createdAt: string;
}
interface BEnquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  preferredLocation?: string;
  propertyInterested?: { _id: string; title: string } | string | null;
  message?: string;
  sourcePage?: string;
  status: string;
  createdAt: string;
}
interface BSiteVisit {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  preferredDate: string;
  preferredTime: string;
  property?: { _id: string; title: string } | string | null;
  location?: string;
  notes?: string;
  status: string;
  createdAt: string;
}
interface BCustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  interestedProperties?: ({ _id: string; title: string } | string)[];
  visitHistory?: string[];
  leadStatus: string;
  updatedAt: string;
}
interface BTestimonial {
  _id: string;
  customerName: string;
  photo?: BMedia;
  rating: number;
  review: string;
  location?: string;
  isActive?: boolean;
}
interface BFaq {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}
interface BOffer {
  _id: string;
  title: string;
  banner?: BMedia;
  description?: string;
  discount?: number;
  startDate: string;
  endDate: string;
  status?: boolean;
}
interface BBlog {
  _id: string;
  title: string;
  slug: string;
  thumbnail?: BMedia;
  category?: string;
  tags?: string[];
  isPublished?: boolean;
  createdAt: string;
}
interface BSettings {
  companyName?: string;
  logo?: BMedia;
  address?: string;
  phoneNumbers?: string[];
  email?: string;
  whatsapp?: string;
  googleMap?: string;
  socialLinks?: SiteSettings["socialLinks"];
  seo?: SiteSettings["seo"];
}

// ---------------------------------------------------------------------------
// Enum label <-> backend value maps
// ---------------------------------------------------------------------------
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const ENQUIRY_STATUSES: { label: EnquiryStatus; value: string }[] = [
  { label: "New", value: "new" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];
export const VISIT_STATUSES: { label: VisitStatus; value: string }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];
export const PROPERTY_STATUSES: { label: Property["status"]; value: string }[] = [
  { label: "Available", value: "available" },
  { label: "Sold", value: "sold" },
  { label: "Upcoming", value: "upcoming" },
];
export const CONSTRUCTION_STATUSES: { label: string; value: string }[] = [
  { label: "Ready to Move", value: "ready_to_move" },
  { label: "Under Construction", value: "under_construction" },
  { label: "New Launch", value: "new_launch" },
];

const enquiryLabel = (v: string): EnquiryStatus =>
  ENQUIRY_STATUSES.find((s) => s.value === v)?.label ?? "New";
const visitLabel = (v: string): VisitStatus =>
  VISIT_STATUSES.find((s) => s.value === v)?.label ?? "Pending";
const propertyStatusLabel = (v?: string): Property["status"] =>
  PROPERTY_STATUSES.find((s) => s.value === v)?.label ?? "Available";
const constructionLabel = (v?: string) =>
  CONSTRUCTION_STATUSES.find((s) => s.value === v)?.label ?? undefined;
export const constructionValue = (label?: string) =>
  CONSTRUCTION_STATUSES.find((s) => s.label === label)?.value ?? undefined;
const customerLabel = (v: string): CustomerStatus => cap(v) as CustomerStatus;

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------
const refTitle = (ref?: { title?: string } | string | null) =>
  ref && typeof ref === "object" ? (ref.title ?? "—") : "—";
const refId = (ref?: { _id?: string } | string | null) =>
  ref ? (typeof ref === "object" ? (ref._id ?? "") : ref) : "";

const mapProperty = (p: BProperty): Property => {
  const images = (p.images ?? []).map((m) => m.url).filter(Boolean) as string[];
  const category =
    p.category && typeof p.category === "object" ? p.category.name : "—";
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    category,
    categoryId: refId(p.category) || undefined,
    price: p.price,
    discountPrice: p.discountPrice || undefined,
    status: propertyStatusLabel(p.status),
    publish: p.available === false ? "Unpublished" : "Published",
    featured: !!p.featured,
    location: p.location,
    address: p.address ?? "",
    latitude: p.latitude,
    longitude: p.longitude,
    description: p.description,
    shortDescription: p.shortDescription,
    amenities: p.amenities ?? [],
    area: p.area ?? 0,
    plotSize: p.plotSize,
    bedrooms: p.bedrooms || undefined,
    bathrooms: p.bathrooms || undefined,
    parking: p.parking || undefined,
    constructionStatus: constructionLabel(p.constructionStatus),
    images: images.length ? images : [PLACEHOLDER_IMG],
    thumbnail: images[0] ?? PLACEHOLDER_IMG,
    views: 0,
    enquiries: 0,
    createdAt: p.createdAt,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    keywords: p.keywords,
  };
};

const mapEnquiry = (e: BEnquiry): Enquiry => ({
  id: e._id,
  name: e.name,
  phone: e.phone,
  email: e.email ?? "",
  location: e.preferredLocation ?? "",
  budget: e.budget ?? "—",
  propertyTitle: refTitle(e.propertyInterested),
  message: e.message ?? "",
  source: e.sourcePage ?? "website",
  createdAt: e.createdAt,
  status: enquiryLabel(e.status),
});

const mapVisit = (v: BSiteVisit): SiteVisit => ({
  id: v._id,
  name: v.name,
  phone: v.phone,
  email: v.email ?? "",
  date: v.preferredDate ? v.preferredDate.slice(0, 10) : "",
  time: v.preferredTime,
  propertyTitle: refTitle(v.property),
  location: v.location ?? "",
  status: visitLabel(v.status),
  notes: v.notes,
  createdAt: v.createdAt,
});

const mapCustomer = (c: BCustomer): Customer => ({
  id: c._id,
  name: c.name,
  phone: c.phone,
  email: c.email ?? "",
  interestedProperties: (c.interestedProperties ?? [])
    .map((p) => (typeof p === "object" ? p.title : ""))
    .filter(Boolean),
  siteVisits: c.visitHistory?.length ?? 0,
  lastContactAt: c.updatedAt,
  status: customerLabel(c.leadStatus),
});

const mapTestimonial = (t: BTestimonial): Testimonial => ({
  id: t._id,
  name: t.customerName,
  photo: t.photo?.url ?? "",
  rating: t.rating,
  review: t.review,
  location: t.location ?? "",
  isActive: t.isActive,
});

const mapFaq = (f: BFaq): Faq => ({
  id: f._id,
  question: f.question,
  answer: f.answer,
  category: f.category ?? "General",
  order: f.order,
  isActive: f.isActive,
});

const mapOffer = (o: BOffer): Offer => ({
  id: o._id,
  title: o.title,
  description: o.description ?? "",
  image: o.banner?.url ?? PLACEHOLDER_IMG,
  discountPct: o.discount ?? 0,
  startDate: o.startDate?.slice(0, 10) ?? "",
  endDate: o.endDate?.slice(0, 10) ?? "",
  status: o.status === false ? "Unpublished" : "Published",
});

const mapBlog = (b: BBlog): Blog => ({
  id: b._id,
  title: b.title,
  slug: b.slug,
  thumbnail: b.thumbnail?.url ?? PLACEHOLDER_IMG,
  category: b.category ?? "General",
  tags: b.tags ?? [],
  publishedAt: b.createdAt,
  status: b.isPublished === false ? "Unpublished" : "Published",
});

const mapSettings = (s: BSettings): SiteSettings => ({
  companyName: s.companyName ?? "",
  logoUrl: s.logo?.url,
  address: s.address ?? "",
  phoneNumbers: s.phoneNumbers ?? [],
  email: s.email ?? "",
  whatsapp: s.whatsapp ?? "",
  googleMap: s.googleMap ?? "",
  socialLinks: s.socialLinks ?? {},
  seo: s.seo ?? {},
});

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------
export interface PropertyInput {
  title: string;
  category: string; // category ObjectId
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription?: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  featured?: boolean;
  status: string; // backend value: available | sold | upcoming
  plotSize?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  constructionStatus?: string; // backend value
  amenities: string[];
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string;
  imageFiles?: File[];
}

function propertyFormData(input: PropertyInput): FormData {
  const fd = new FormData();
  const set = (k: string, v: unknown) => {
    if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
  };
  set("title", input.title);
  set("category", input.category);
  set("price", input.price);
  set("discountPrice", input.discountPrice);
  set("description", input.description);
  set("shortDescription", input.shortDescription);
  set("location", input.location);
  set("address", input.address);
  set("latitude", input.latitude);
  set("longitude", input.longitude);
  set("featured", input.featured ? "true" : "false");
  set("status", input.status);
  set("plotSize", input.plotSize);
  set("area", input.area);
  set("bedrooms", input.bedrooms);
  set("bathrooms", input.bathrooms);
  set("parking", input.parking);
  set("constructionStatus", input.constructionStatus);
  set("amenities", input.amenities.join(","));
  set("seoTitle", input.seoTitle);
  set("seoDescription", input.seoDescription);
  set("keywords", input.keywords);
  (input.imageFiles ?? []).forEach((f) => fd.append("images", f));
  return fd;
}

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const propertyService = {
  list: async (): Promise<Property[]> =>
    (await unwrap<BProperty[]>(api.get(`/properties?limit=${LIST_LIMIT}`))).map(mapProperty),
  get: async (id: string): Promise<Property | null> =>
    mapProperty(await unwrap<BProperty>(api.get(`/properties/${id}`))),
  create: async (input: PropertyInput): Promise<Property> =>
    mapProperty(
      await unwrap<BProperty>(api.post("/properties", propertyFormData(input), multipart)),
    ),
  update: async (id: string, input: PropertyInput): Promise<Property> =>
    mapProperty(
      await unwrap<BProperty>(api.put(`/properties/${id}`, propertyFormData(input), multipart)),
    ),
  remove: async (id: string) => {
    await api.delete(`/properties/${id}`);
    return { id, ok: true };
  },
};

// ---------------------------------------------------------------------------
// Media library (standalone gallery uploads — shown in the website gallery)
// ---------------------------------------------------------------------------
interface BMediaDoc {
  _id: string;
  url: string;
  publicId: string;
  resourceType?: string;
  originalName?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  resourceType: string;
  originalName?: string;
  createdAt: string;
}

export const mediaService = {
  list: async (): Promise<MediaItem[]> =>
    (await unwrap<BMediaDoc[]>(api.get(`/media?limit=${LIST_LIMIT}&sort=-createdAt`))).map((m) => ({
      id: m._id,
      url: m.url,
      publicId: m.publicId,
      resourceType: m.resourceType ?? "image",
      originalName: m.originalName,
      createdAt: m.createdAt,
    })),
  upload: async (files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("folder", "real-estate/gallery");
    return unwrap<BMediaDoc[]>(api.post("/media/upload-multiple", fd, multipart));
  },
  remove: (publicId: string, resourceType = "image") =>
    api.delete(`/media/${encodeURIComponent(publicId)}?resourceType=${resourceType}`),
};

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categoryService = {
  list: async (): Promise<Category[]> => {
    const [cats, props] = await Promise.all([
      unwrap<BCategory[]>(api.get(`/categories?limit=${LIST_LIMIT}`)),
      unwrap<BProperty[]>(api.get(`/properties?limit=${LIST_LIMIT}&fields=category`)).catch(
        () => [] as BProperty[],
      ),
    ]);
    const counts = new Map<string, number>();
    for (const p of props) {
      const id = refId(p.category);
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return cats.map((c) => ({
      id: c._id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      isActive: c.isActive,
      count: counts.get(c._id) ?? 0,
    }));
  },
  create: (data: { name: string; description?: string }) =>
    unwrap<BCategory>(api.post("/categories", data)),
  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) =>
    unwrap<BCategory>(api.put(`/categories/${id}`, data)),
  remove: (id: string) => api.delete(`/categories/${id}`),
};

// ---------------------------------------------------------------------------
// Leads: Enquiries & Site Visits
// ---------------------------------------------------------------------------
export const enquiryService = {
  list: async (): Promise<Enquiry[]> =>
    (await unwrap<BEnquiry[]>(api.get(`/enquiries?limit=${LIST_LIMIT}&sort=-createdAt`))).map(
      mapEnquiry,
    ),
  updateStatus: (id: string, status: string) =>
    unwrap<BEnquiry>(api.put(`/enquiries/${id}`, { status })),
  remove: (id: string) => api.delete(`/enquiries/${id}`),
};

export const visitService = {
  list: async (): Promise<SiteVisit[]> =>
    (await unwrap<BSiteVisit[]>(api.get(`/site-visits?limit=${LIST_LIMIT}&sort=-createdAt`))).map(
      mapVisit,
    ),
  updateStatus: (id: string, status: string) =>
    unwrap<BSiteVisit>(api.put(`/site-visits/${id}`, { status })),
  remove: (id: string) => api.delete(`/site-visits/${id}`),
};

export const customerService = {
  list: async (): Promise<Customer[]> =>
    (await unwrap<BCustomer[]>(api.get(`/customers?limit=${LIST_LIMIT}&sort=-updatedAt`))).map(
      mapCustomer,
    ),
};

// ---------------------------------------------------------------------------
// Content: Testimonials, FAQs, Offers, Blogs
// ---------------------------------------------------------------------------
export interface TestimonialInput {
  customerName: string;
  rating: number;
  review: string;
  location?: string;
  isActive?: boolean;
  photoFile?: File | null;
}

function testimonialFormData(input: TestimonialInput): FormData {
  const fd = new FormData();
  fd.append("customerName", input.customerName);
  fd.append("rating", String(input.rating));
  fd.append("review", input.review);
  if (input.location) fd.append("location", input.location);
  if (input.isActive !== undefined) fd.append("isActive", String(input.isActive));
  if (input.photoFile) fd.append("photo", input.photoFile);
  return fd;
}

export const testimonialService = {
  list: async (): Promise<Testimonial[]> =>
    (await unwrap<BTestimonial[]>(api.get(`/testimonials?limit=${LIST_LIMIT}`))).map(
      mapTestimonial,
    ),
  create: (input: TestimonialInput) =>
    unwrap<BTestimonial>(api.post("/testimonials", testimonialFormData(input), multipart)),
  update: (id: string, input: TestimonialInput) =>
    unwrap<BTestimonial>(api.put(`/testimonials/${id}`, testimonialFormData(input), multipart)),
  remove: (id: string) => api.delete(`/testimonials/${id}`),
};

export interface FaqInput {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}

export const faqService = {
  list: async (): Promise<Faq[]> =>
    (await unwrap<BFaq[]>(api.get(`/faqs?limit=${LIST_LIMIT}&sort=order`))).map(mapFaq),
  create: (input: FaqInput) => unwrap<BFaq>(api.post("/faqs", input)),
  update: (id: string, input: FaqInput) => unwrap<BFaq>(api.put(`/faqs/${id}`, input)),
  remove: (id: string) => api.delete(`/faqs/${id}`),
};

export interface OfferInput {
  title: string;
  description?: string;
  discount?: number;
  startDate: string;
  endDate: string;
  status?: boolean;
  bannerFile?: File | null;
}

function offerFormData(input: OfferInput): FormData {
  const fd = new FormData();
  fd.append("title", input.title);
  if (input.description) fd.append("description", input.description);
  if (input.discount !== undefined) fd.append("discount", String(input.discount));
  fd.append("startDate", input.startDate);
  fd.append("endDate", input.endDate);
  if (input.status !== undefined) fd.append("status", String(input.status));
  if (input.bannerFile) fd.append("banner", input.bannerFile);
  return fd;
}

export const offerService = {
  list: async (): Promise<Offer[]> =>
    (await unwrap<BOffer[]>(api.get(`/offers?limit=${LIST_LIMIT}`))).map(mapOffer),
  create: (input: OfferInput) =>
    unwrap<BOffer>(api.post("/offers", offerFormData(input), multipart)),
  update: (id: string, input: OfferInput) =>
    unwrap<BOffer>(api.put(`/offers/${id}`, offerFormData(input), multipart)),
  remove: (id: string) => api.delete(`/offers/${id}`),
};

export const blogService = {
  list: async (): Promise<Blog[]> =>
    (await unwrap<BBlog[]>(api.get(`/blogs?limit=${LIST_LIMIT}`))).map(mapBlog),
};

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export interface SettingsInput {
  companyName?: string;
  address?: string;
  phoneNumbers?: string[];
  email?: string;
  whatsapp?: string;
  googleMap?: string;
  socialLinks?: SiteSettings["socialLinks"];
  seo?: SiteSettings["seo"];
  logoFile?: File | null;
}

export const settingsService = {
  get: async (): Promise<SiteSettings> =>
    mapSettings(await unwrap<BSettings>(api.get("/settings"))),
  update: async (input: SettingsInput): Promise<SiteSettings> => {
    const { logoFile, ...rest } = input;
    if (logoFile) {
      const fd = new FormData();
      fd.append("logo", logoFile);
      // multipart bodies flatten nested objects poorly — send scalars via FormData,
      // then nested objects via a follow-up JSON PUT
      await api.put("/settings", fd, multipart);
    }
    return mapSettings(await unwrap<BSettings>(api.put("/settings", rest)));
  },
};

// ---------------------------------------------------------------------------
// Dashboard — aggregated client-side from real endpoints
// ---------------------------------------------------------------------------
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function lastTwelveMonths(): { key: string; month: string }[] {
  const out: { key: string; month: string }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      month: MONTH_NAMES[d.getMonth()],
    });
  }
  return out;
}

const monthKey = (iso?: string) => (iso ? iso.slice(0, 7) : "");
const isToday = (iso?: string) =>
  !!iso && iso.slice(0, 10) === new Date().toISOString().slice(0, 10);

async function fetchAllForDashboard() {
  const [properties, enquiries, visits, offers, categories] = await Promise.all([
    propertyService.list(),
    enquiryService.list(),
    visitService.list(),
    offerService.list(),
    categoryService.list(),
  ]);
  return { properties, enquiries, visits, offers, categories };
}

export const dashboardService = {
  stats: async () => {
    const { properties, enquiries, visits, offers, categories } = await fetchAllForDashboard();
    return {
      totalProperties: properties.length,
      available: properties.filter((p) => p.status === "Available").length,
      sold: properties.filter((p) => p.status === "Sold").length,
      pendingEnquiries: enquiries.filter((e) => e.status === "New").length,
      todaysEnquiries: enquiries.filter((e) => isToday(e.createdAt)).length,
      totalVisits: visits.length,
      offersRunning: offers.filter((o) => o.status === "Published").length,
      totalCategories: categories.length,
    };
  },
  monthly: async () => {
    const [enquiries, visits] = await Promise.all([enquiryService.list(), visitService.list()]);
    return lastTwelveMonths().map(({ key, month }) => ({
      month,
      views: visits.filter((v) => monthKey(v.createdAt) === key).length,
      enquiries: enquiries.filter((e) => monthKey(e.createdAt) === key).length,
    }));
  },
  revenue: async () => {
    const properties = await propertyService.list();
    return lastTwelveMonths().map(({ key, month }) => ({
      month,
      revenue: Number(
        (
          properties
            .filter((p) => p.status === "Sold" && monthKey(p.createdAt) === key)
            .reduce((sum, p) => sum + (p.discountPrice ?? p.price), 0) / 1e7
        ).toFixed(2),
      ),
    }));
  },
  latestEnquiries: async () => (await enquiryService.list()).slice(0, 5),
  latestProperties: async () => (await propertyService.list()).slice(0, 5),
  recentVisitors: async () => (await visitService.list()).slice(0, 5),
  categoryDistribution: async () =>
    (await categoryService.list())
      .filter((c) => c.count > 0)
      .map((c) => ({ name: c.name, value: c.count })),
};
