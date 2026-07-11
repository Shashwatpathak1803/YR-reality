import prop1 from "@/assets/prop1.jpg";
import prop2 from "@/assets/prop2.jpg";
import prop3 from "@/assets/prop3.jpg";
import prop4 from "@/assets/prop4.jpg";
import prop5 from "@/assets/prop5.jpg";
import prop6 from "@/assets/prop6.jpg";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  propertyType: string;
  description: string;
  images: string[];
  featured: boolean;
  status: "Available" | "Sold";
};

export const properties: Property[] = [
  {
    id: "p1",
    title: "Emerald Villa Estate",
    location: "Gurugram, Sector 65",
    price: "₹ 3.85 Cr",
    area: "3200 sq.ft",
    propertyType: "Luxury Villa",
    description: "4BHK independent villa with private pool, landscaped garden and premium interiors.",
    images: [prop1, prop3, prop6],
    featured: true,
    status: "Available",
  },
  {
    id: "p2",
    title: "Greenfield Residential Plot",
    location: "Noida Extension",
    price: "₹ 78 Lakh",
    area: "250 sq.yd",
    propertyType: "Residential Plot",
    description: "Corner plot in a gated township with parks, wide roads and 24×7 security.",
    images: [prop2, prop5],
    featured: true,
    status: "Available",
  },
  {
    id: "p3",
    title: "Skyline Premium Apartments",
    location: "Dwarka Expressway",
    price: "₹ 1.42 Cr",
    area: "1650 sq.ft",
    propertyType: "Apartment",
    description: "3BHK sky residences with panoramic city views, clubhouse and infinity pool.",
    images: [prop3, prop6, prop1],
    featured: true,
    status: "Available",
  },
  {
    id: "p4",
    title: "CBD Commercial Plot",
    location: "Faridabad Neharpar",
    price: "₹ 2.10 Cr",
    area: "500 sq.yd",
    propertyType: "Commercial Plot",
    description: "High footfall commercial plot facing 60ft road, ideal for retail or office.",
    images: [prop4, prop2],
    featured: true,
    status: "Available",
  },
  {
    id: "p5",
    title: "Serene Countryside Farmhouse",
    location: "Chattarpur, Delhi",
    price: "₹ 6.25 Cr",
    area: "1 Acre",
    propertyType: "Farm House",
    description: "Private farmhouse with orchard, pool and modern interiors on 1 acre land.",
    images: [prop5, prop1],
    featured: true,
    status: "Sold",
  },
  {
    id: "p6",
    title: "Urban Nest Flats",
    location: "Ghaziabad, Raj Nagar",
    price: "₹ 62 Lakh",
    area: "1150 sq.ft",
    propertyType: "Flat",
    description: "2BHK ready-to-move flat with modular kitchen and covered parking.",
    images: [prop6, prop3],
    featured: true,
    status: "Available",
  },
];
