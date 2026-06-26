/**
 * Central, static site configuration for AKR Nexus.
 * Real brand facts only — no fabricated stats, testimonials, or metrics.
 * Anything that must be populated by the admin lives in the database, not here.
 */

export const site = {
  name: "AKR Nexus",
  legalName: "AKR Nexus",
  tagline: "Connecting Vision. Creating Value.",
  akrFullForm: "Aspiration · Knowledge · Reliability",
  akrHindiForm: "Aastha · Kshamta · Rishta",
  description:
    "AKR Nexus is a Deoghar-based real estate advisory, brokerage and developer-partnership company — guiding you from your first site visit to final possession with transparency and end-to-end accountability.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://akrnexus.com",
  locale: "en_IN",
  city: "Deoghar",
  state: "Jharkhand",
  country: "India",
  address: "Deoghar, Jharkhand, India",
  phone: "+918210480043",
  phoneDisplay: "+91 82104 80043",
  whatsapp: "918210480043",
  email: "nexusakr@gmail.com",
} as const;

export const subBrand = {
  name: "Dham Developers",
  tagline: "From Property to Possession.",
  description:
    "Dham Developers is the development arm of AKR Nexus — designing, building and delivering homes and projects in the Deoghar region.",
} as const;

export const social = {
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  twitter: "",
} as const;

/** Primary navigation (clean 6-item bar; deeper pages live in menus/footer). */
export const mainNav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Ventures", href: "/ventures" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

/** Secondary / segment pages surfaced in mega-menus and the footer. */
export const segmentNav: { label: string; href: string }[] = [
  { label: "Customer Programs", href: "/customer-programs" },
  { label: "Investor", href: "/investor" },
  { label: "Partner With Us", href: "/partner-with-us" },
  { label: "NRI Property Care", href: "/nri-property-care" },
];

/** All six enquiry types map to the `enquiry_type` column on `leads`. */
export const enquiryTypes = [
  { value: "general", label: "General Enquiry" },
  { value: "consultation", label: "Consultation Enquiry" },
  { value: "investor", label: "Investor Enquiry" },
  { value: "partner", label: "Partner Enquiry" },
  { value: "nri", label: "NRI Enquiry" },
  { value: "dham", label: "Dham Developers Enquiry" },
] as const;

export type EnquiryType = (typeof enquiryTypes)[number]["value"];

/** Interest types shown in short lead-capture forms (auto-routing hint). */
export const interestTypes = [
  { value: "buy", label: "Buy a property" },
  { value: "invest", label: "Invest" },
  { value: "partner", label: "Partner / Collaborate" },
  { value: "program", label: "Customer Program" },
  { value: "nri", label: "NRI Property Care" },
  { value: "other", label: "Other" },
] as const;

/** Lead pipeline stages — ordered, used by the CRM board. */
export const leadStatuses = [
  { value: "new", label: "New Lead", color: "#3a5c93" },
  { value: "contacted", label: "Contacted", color: "#2a4575" },
  { value: "interested", label: "Interested", color: "#a87f30" },
  { value: "site_visit_scheduled", label: "Site Visit Scheduled", color: "#c5a047" },
  { value: "negotiation", label: "Negotiation", color: "#d4ac4a" },
  { value: "converted", label: "Converted", color: "#2f8a4f" },
  { value: "closed", label: "Closed", color: "#5b6573" },
] as const;

export type LeadStatus = (typeof leadStatuses)[number]["value"];

/**
 * The six signature customer programs (real, from the business strategy).
 * Used as fallback content; admin can override copy via the CMS.
 */
export const customerPrograms = [
  {
    slug: "shakti",
    name: "Shakti Home Ownership Initiative",
    segment: "Women",
    summary:
      "Women-first advisory, safety-vetted properties, and guidance on joint or sole titles to put women confidently onto ownership.",
  },
  {
    slug: "guru-griha",
    name: "Guru Griha Advantage Program",
    segment: "Teachers",
    summary:
      "Fee-light, flexible assistance with an affordable-home shortlist plus loan and documentation hand-holding.",
  },
  {
    slug: "veer-awas",
    name: "Veer Awas Program",
    segment: "Defence Personnel",
    summary:
      "Fully-managed remote buying while posted away, with secure investment options and a trusted point-of-contact.",
  },
  {
    slug: "healthcare",
    name: "Healthcare Professionals Property Program",
    segment: "Doctors",
    summary:
      "Concierge, time-saving service for premium homes and clinic/commercial space, scheduled around demanding hours.",
  },
  {
    slug: "nri-care",
    name: "NRI Property Care Program",
    segment: "NRIs",
    summary:
      "Virtual tours, end-to-end legal & registration, and ongoing property upkeep, monitoring and reporting from afar.",
  },
  {
    slug: "first-home",
    name: "First Home Advantage Program",
    segment: "First-time / local families",
    summary:
      "Step-by-step guidance, loan facilitation, transparent pricing, and extra documentation support for first-time buyers.",
  },
] as const;

/** Core services (asset-light, currently active). */
export const services = [
  {
    slug: "brokerage",
    title: "Real Estate Brokerage",
    summary:
      "Connecting buyers and sellers of land, homes and commercial property across the Deoghar region.",
  },
  {
    slug: "consultancy",
    title: "Property Consultancy",
    summary:
      "Advisory on pricing, location, legal due-diligence and investment suitability.",
  },
  {
    slug: "end-to-end-assistance",
    title: "End-to-End Assistance",
    summary:
      "Title checks, documentation, registration, loan facilitation and possession support.",
  },
  {
    slug: "developer-partnerships",
    title: "Developer Partnerships",
    summary:
      "Marketing and selling vetted inventory on behalf of developers under structured arrangements.",
  },
  {
    slug: "nri-services",
    title: "NRI Services",
    summary:
      "Remote, trustworthy buying and ongoing property care for non-resident Indians.",
  },
] as const;

/**
 * Future divisions — all "Coming Soon" per current business reality.
 * Only Dham Developers is an active venture.
 */
export const divisions = [
  {
    slug: "construction",
    title: "Construction Division",
    status: "coming_soon",
    summary: "Contracting and execution for own and third-party projects.",
  },
  {
    slug: "infrastructure",
    title: "Infrastructure Division",
    status: "coming_soon",
    summary: "Roads, civic amenities and project-level public infrastructure.",
  },
  {
    slug: "investment",
    title: "Investment Division",
    status: "coming_soon",
    summary: "Co-investment, land banking and project returns.",
  },
  {
    slug: "proptech",
    title: "PropTech Division",
    status: "coming_soon",
    summary: "Digital platforms for discovery, transparency and documentation.",
  },
] as const;

/** Build a click-to-WhatsApp URL with an optional pre-filled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a tel: link. */
export function telUrl(): string {
  return `tel:${site.phone}`;
}

/** Build a mailto: link. */
export function mailtoUrl(subject?: string): string {
  return subject
    ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${site.email}`;
}
