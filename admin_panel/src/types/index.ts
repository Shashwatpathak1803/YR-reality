export type PropertyStatus = "Available" | "Sold" | "Upcoming";
export type PublishStatus = "Published" | "Unpublished" | "Archived";
export type EnquiryStatus = "New" | "In Progress" | "Resolved" | "Closed";
export type VisitStatus = "Pending" | "Approved" | "Completed" | "Cancelled";
export type CustomerStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Negotiation"
  | "Converted"
  | "Lost";

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  description?: string;
  isActive?: boolean;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId?: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  status: PropertyStatus;
  publish: PublishStatus;
  featured: boolean;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  mapLink?: string;
  description: string;
  shortDescription?: string;
  amenities: string[];
  area: number; // sq ft
  plotSize?: string;
  facing?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  floors?: number;
  constructionStatus?: string;
  images: string[];
  thumbnail: string;
  views: number;
  enquiries: number;
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discountPct: number;
  startDate: string;
  endDate: string;
  status: PublishStatus;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyTitle: string;
  message: string;
  source: string;
  createdAt: string;
  status: EnquiryStatus;
}

export interface SiteVisit {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  propertyTitle: string;
  location: string;
  status: VisitStatus;
  agent?: string;
  notes?: string;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  interestedProperties: string[];
  siteVisits: number;
  lastContactAt: string;
  status: CustomerStatus;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  review: string;
  location: string;
  isActive?: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
  tags: string[];
  publishedAt: string;
  status: PublishStatus;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
  isActive?: boolean;
}

export interface SiteSettings {
  companyName: string;
  logoUrl?: string;
  address: string;
  phoneNumbers: string[];
  email: string;
  whatsapp: string;
  googleMap: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}
