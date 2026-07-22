import t1 from "@/assets/t1.jpg";
import t2 from "@/assets/t2.jpg";
import t3 from "@/assets/t3.jpg";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rohit Sharma",
    role: "Villa Buyer, Gurugram",
    avatar: t1,
    rating: 5,
    quote:
      "Y Realty made buying our dream villa effortless. Verified documents, transparent pricing and a team that genuinely cares.",
  },
  {
    id: "2",
    name: "Priya Verma",
    role: "Plot Investor, Noida",
    avatar: t2,
    rating: 5,
    quote:
      "The site visit was well planned and every question was answered. I invested in a plot with complete peace of mind.",
  },
  {
    id: "3",
    name: "Anil Mehta",
    role: "Commercial Investor",
    avatar: t3,
    rating: 5,
    quote:
      "Great locations, great pricing and superb loan assistance. My commercial plot deal closed in under 3 weeks.",
  },
];
