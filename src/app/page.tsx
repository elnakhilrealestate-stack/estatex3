import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses, projects, testimonials } from "@/db/schema";
import Header from "@/components/Header";
import { Courses, Footer, Hero, Partners, Projects, Sell } from "@/components/sections";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

// Fallback high-fidelity mock data if database is not reachable at build time
const fallbackProjects = [
  {
    id: 1,
    name: "Dar Misr El Obour (دار مصر العبور)",
    location: "Obour City (مدينة العبور)",
    developer: "EstateX Resales",
    priceFrom: "EGP 1.85M",
    downPayment: "Cash / Inst",
    installments: "Immediate",
    tag: "Ready",
    description: "شقة سكنية مميزة للبيع في دار مصر العبور بمساحة 100م٢. تتميز بموقعها الإستراتيجي المميز (موقع 1) بجوار مسجد الحبيب المصطفى. تسليم فوري وتشطيب فاخر جاهز للسكن مباشرة، فرصة استثمارية وسكنية لا تتكرر.",
    image: "https://images.pexels.com/photos/8082227/pexels-photo-8082227.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    featured: true,
    sort: 1,
  },
  {
    id: 2,
    name: "The Crown Residences",
    location: "New Cairo",
    developer: "SODIC",
    priceFrom: "EGP 8.4M",
    downPayment: "10%",
    installments: "8 Years",
    tag: "Off-Plan",
    description: "Luxury double-height apartments with sweeping green ridge views, walking tracks, and world-class retail spaces at the prestigious SODIC New Cairo expansion corridor.",
    image: "https://images.pexels.com/photos/18549956/pexels-photo-18549956.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    featured: true,
    sort: 2,
  },
  {
    id: 3,
    name: "Elite Garden Villas",
    location: "Obour City — 5th District",
    developer: "EstateX Exclusive",
    priceFrom: "EGP 12.2M",
    downPayment: "20%",
    installments: "5 Years",
    tag: "Ready",
    description: "Exclusive standby smart villas with independent solar power systems, private pool courts, and high boundary security fences. Absolute luxury in city heart.",
    image: "https://images.pexels.com/photos/27626185/pexels-photo-27626185.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    featured: true,
    sort: 3,
  }
];

const fallbackTestimonials = [
  {
    id: 1,
    name: "Sherif El-Ghandour",
    role: "Property Investor",
    company: "Obour Trade Corp",
    quote: "Excellent experience buy/sell with EstateX. They completed the resale of my apartment in Dar Misr Obour with maximum speed and at a superb valuation. Highly professional service.",
    rating: 5,
    sort: 1,
  },
  {
    id: 2,
    name: "Amr Abdel-Fattah",
    role: "Business Owner",
    company: "Alex Logistics",
    quote: "EstateX Real Estate Solutions helped me secure a premium commercial unit in New Cairo with an incredibly comfortable payment plan. Truly trusted advisors.",
    rating: 5,
    sort: 2,
  }
];

const fallbackCourses = [
  {
    id: 1,
    title: "Obour City Real Estate Landscape",
    category: "Local Market",
    duration: "1h 45m",
    lessons: 8,
    level: "Beginner",
    description: "Pricing benchmarks, zoning laws, and upcoming major infrastructure developments in Obour City and neighborhood zones.",
    accent: "#33260f",
    sort: 1,
  },
  {
    id: 2,
    title: "Off-Plan Property Risk Assessment",
    category: "Investing",
    duration: "3h 10m",
    lessons: 15,
    level: "Intermediate",
    description: "Checking Egyptian developer license status, construction milestones, and contract escape clauses to protect your capital.",
    accent: "#1c2733",
    sort: 2,
  }
];

export default async function Home() {
  let projectRows = [];
  let testimonialRows = [];
  let courseRows = [];

  try {
    const [p, t, c] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.featured, true))
        .orderBy(asc(projects.sort), desc(projects.id)),
      db
        .select()
        .from(testimonials)
        .orderBy(asc(testimonials.sort), asc(testimonials.id)),
      db
        .select()
        .from(courses)
        .orderBy(asc(courses.sort), asc(courses.id)),
    ]);
    projectRows = p;
    testimonialRows = t;
    courseRows = c;
  } catch (err) {
    console.warn("Database is not reachable during build time, using high-fidelity fallback mocks:", err);
    projectRows = fallbackProjects;
    testimonialRows = fallbackTestimonials;
    courseRows = fallbackCourses;
  }

  // Double check that if db returned empty, we still have fallbacks to render gracefully
  if (!projectRows || projectRows.length === 0) projectRows = fallbackProjects;
  if (!testimonialRows || testimonialRows.length === 0) testimonialRows = fallbackTestimonials;
  if (!courseRows || courseRows.length === 0) courseRows = fallbackCourses;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects projects={projectRows as any} />
        <Sell />
        <Partners />
        <Testimonials items={testimonialRows} />
        <Courses courses={courseRows} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
