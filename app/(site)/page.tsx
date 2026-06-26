import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileCheck2,
  Handshake,
  MapPinned,
  Building2,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBand } from "@/components/site/cta-band";
import { LeadForm } from "@/components/site/lead-form";
import {
  services as staticServices,
  customerPrograms as staticPrograms,
  site,
  subBrand,
} from "@/lib/site";
import {
  getFeaturedVentures,
  getPrograms,
  getPublishedPartners,
  getPublishedPosts,
  getPublishedTestimonials,
} from "@/lib/data";
import { formatDate } from "@/lib/utils";

const whyChooseUs = [
  { icon: ShieldCheck, title: "Transparency", text: "Clear pricing, documents and timelines — explained in plain language." },
  { icon: FileCheck2, title: "Verified Titles", text: "We check titles and paperwork before we ever recommend a property." },
  { icon: Handshake, title: "End-to-End", text: "One partner from first site visit to final possession — and beyond." },
  { icon: MapPinned, title: "Local Mastery", text: "Deep, on-the-ground knowledge of Deoghar's neighbourhoods and corridors." },
  { icon: Building2, title: "Dham Build Arm", text: "Through Dham Developers we build, not just broker — proof we deliver." },
  { icon: HeartHandshake, title: "After-Sales Care", text: "Ongoing support and relationships, measured in referrals not transactions." },
];

export default async function HomePage() {
  const [featured, programs, partners, posts, testimonials] = await Promise.all([
    getFeaturedVentures(),
    getPrograms(),
    getPublishedPartners(),
    getPublishedPosts(3),
    getPublishedTestimonials(),
  ]);

  const programList = programs.length ? programs : staticPrograms;

  return (
    <>
      {/* 1 · Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #1a3a66 0, transparent 45%), radial-gradient(circle at 80% 0%, #c5a047 0, transparent 35%)",
          }}
        />
        <Container className="relative grid gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
              {site.name} · Deoghar
            </p>
            <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">
              Your Trusted Property Partner in Deoghar
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-100">
              From your first site visit to final possession — guided with
              transparency, local expertise and end-to-end accountability.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">
                Schedule Consultation
              </Button>
              <Button href="/ventures" variant="outlineLight" size="lg">
                Explore Ventures
              </Button>
            </div>
            {/* Trust qualifiers (promises, not fabricated metrics) */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-200">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-300" /> Transparent dealing
              </span>
              <span className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-gold-300" /> Title-verified listings
              </span>
              <span className="flex items-center gap-2">
                <Handshake className="h-4 w-4 text-gold-300" /> End-to-end support
              </span>
            </div>
          </div>

          {/* Inline hero lead form */}
          <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl lg:justify-self-end lg:max-w-md">
            <h2 className="font-serif text-xl text-navy-900">Talk to an advisor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share a few details and we'll reach out shortly.
            </p>
            <div className="mt-4">
              <LeadForm
                enquiryType="consultation"
                lockEnquiryType
                source="home-hero"
                compact
                submitLabel="Request a Call Back"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2 · About snapshot */}
      <section className="py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="About AKR Nexus"
              title="Connecting Vision. Creating Value."
            />
            <p className="mt-4 text-muted-foreground">
              AKR stands for{" "}
              <strong className="text-navy-800">{site.akrFullForm}</strong> — and
              in the language of the region, {site.akrHindiForm} (Faith ·
              Capability · Relationships). We are a Deoghar-based real estate
              advisory, brokerage and developer-partnership company that earns
              trust at the advisory stage and keeps it all the way to possession.
            </p>
            <p className="mt-3 text-muted-foreground">
              Through our development arm, {subBrand.name}, we move{" "}
              <em>“{subBrand.tagline}”</em> — building the homes and projects we
              once only helped people find.
            </p>
            <Button href="/about" variant="secondary" className="mt-6">
              Learn About Us <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-2xl border border-border bg-muted p-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {["Aspiration", "Knowledge", "Reliability"].map((v, i) => (
                <li key={v} className="rounded-xl bg-white p-5 shadow-sm">
                  <span className="font-serif text-2xl text-gold-600">
                    0{i + 1}
                  </span>
                  <p className="mt-1 font-semibold text-navy-900">{v}</p>
                </li>
              ))}
              <li className="rounded-xl bg-navy-900 p-5 text-white shadow-sm">
                <p className="font-serif text-lg">Vision to Value</p>
                <p className="mt-1 text-sm text-navy-100">
                  Trust across discovery, development & delivery.
                </p>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* 3 · Services */}
      <section className="bg-muted py-16">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="Services"
            subtitle="End-to-end property assistance — from advice and brokerage to documentation and possession."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {staticServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services#${s.slug}`}
                className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-serif text-lg text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-700">
                  Learn more{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 · Ventures */}
      <section className="py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={subBrand.name}
              title="Our Ventures"
              subtitle={`${subBrand.name} is our active development venture. ${subBrand.tagline}`}
            />
            <Button href="/ventures" variant="secondary">
              Explore Ventures
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((v) => (
                <Link
                  key={v.id}
                  href={`/ventures/${v.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-navy-100">
                    {v.cover_image && (
                      <Image
                        src={v.cover_image}
                        alt={v.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    )}
                    <span className="absolute left-3 top-3">
                      <Badge variant={v.venture_status}>
                        {v.venture_status.replace("_", " ")}
                      </Badge>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg text-navy-900">{v.title}</h3>
                    {v.location && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {v.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-muted p-10 text-center">
              <Building2 className="mx-auto h-10 w-10 text-gold-600" />
              <h3 className="mt-3 font-serif text-xl text-navy-900">
                Projects launching soon
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                {subBrand.name} projects will appear here as they are announced.
                Register your interest and we'll keep you informed first.
              </p>
              <Button href="/contact" className="mt-5">
                Register Interest
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* 5 · Customer Programs */}
      <section className="bg-navy-900 py-16">
        <Container>
          <SectionHeading
            light
            eyebrow="For People Like You"
            title="Customer Programs"
            subtitle="Six signature programs tailored to the real concerns of the people we serve."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programList.map((p) => (
              <div
                key={p.slug}
                className="rounded-xl border border-white/10 bg-navy-800 p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">
                  {p.segment}
                </p>
                <h3 className="mt-1 font-serif text-lg text-white">{p.name}</h3>
                <p className="mt-2 text-sm text-navy-100">{p.summary}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href="/customer-programs">See if you qualify</Button>
          </div>
        </Container>
      </section>

      {/* 6 · Partners — only when admin has published partner logos */}
      {partners.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading
              align="center"
              eyebrow="Trusted Associations"
              title="Partners & Associates"
            />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 opacity-90">
              {partners.map((p) =>
                p.logo_url ? (
                  <div key={p.id} className="relative h-12 w-32">
                    <Image
                      src={p.logo_url}
                      alt={p.name}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                ) : (
                  <span key={p.id} className="text-navy-700">
                    {p.name}
                  </span>
                )
              )}
            </div>
          </Container>
        </section>
      )}

      {/* 7 · Why Choose Us */}
      <section className="bg-muted py-16">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why AKR Nexus"
            title="Built on Trust, Not Just Transactions"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((w) => (
              <div key={w.title} className="rounded-xl bg-white p-6 shadow-sm">
                <w.icon className="h-8 w-8 text-gold-600" />
                <h3 className="mt-3 font-serif text-lg text-navy-900">
                  {w.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials — only when admin has added real ones */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <Container>
            <SectionHeading align="center" eyebrow="In Their Words" title="Testimonials" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="rounded-xl border border-border bg-white p-6"
                >
                  <blockquote className="text-navy-800">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-navy-900">
                    {t.author_name}
                    {t.author_role && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {t.author_role}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 8 · Blog highlights — only when posts exist */}
      {posts.length > 0 && (
        <section className="bg-muted py-16">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Insights" title="From Our Blog" />
              <Button href="/blog" variant="secondary">
                Read Insights
              </Button>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] bg-navy-100">
                    {post.cover_image && (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(post.published_at)}
                    </p>
                    <h3 className="mt-1 font-serif text-lg text-navy-900">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9 · Contact CTA */}
      <CtaBand />
    </>
  );
}
