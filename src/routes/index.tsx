import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Clock, Leaf, MapPin, Phone, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared";
import { ServiceCard } from "@/components/service-card";
import { useContent, useGallery, useServices, useTeam } from "@/hooks/use-data";
import { img } from "@/lib/images";
import {
  demoGallery,
  demoServices,
  demoSiteCopy,
  demoTeam,
  sampleTestimonials,
  wellnessPillars,
} from "@/lib/demo-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salus Per Aquam — Luxury Massage & Spa" },
      {
        name: "description",
        content:
          "Return to stillness. Book Swedish, deep tissue, hot stone and aromatherapy massage at Salus Per Aquam.",
      },
      { property: "og:title", content: "Salus Per Aquam — Luxury Massage & Spa" },
      { property: "og:description", content: "Massage rituals crafted to restore body and mind." },
    ],
  }),
  component: Home,
});

const why = [
  {
    I: Award,
    t: "Certified therapists",
    d: "Every therapist is trained, licensed and deeply experienced.",
  },
  { I: Leaf, t: "Natural ingredients", d: "Organic oils and botanicals, blended in-house." },
  { I: Sparkles, t: "Tailored rituals", d: "Pressure, scent and focus adapted to you." },
  { I: Clock, t: "Unhurried time", d: "No rushing — every treatment ends with tea and rest." },
];

function Home() {
  const { data: c } = useContent();
  const services = useServices();
  const team = useTeam();
  const gallery = useGallery();
  if (!c) return null;
  const publicServices = services.data?.filter((service) => service.active) ?? [];
  const featuredServices = publicServices.length ? publicServices : demoServices;
  const publicTeam = team.data?.filter((member) => member.active) ?? [];
  const featuredTeam = publicTeam.length ? publicTeam : demoTeam;
  const publicGallery = gallery.data?.filter((item) => item.visible) ?? [];
  const featuredGallery = publicGallery.length ? publicGallery : demoGallery;

  return (
    <main>
      <section className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden 2xl:min-h-[52rem]">
        <img
          src={img(c.hero.image || "asset:hero")}
          alt="Spa treatment room"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-veil" />
        <div className="container-spa relative text-earth-foreground">
          <div className="max-w-5xl fade-up">
            <p className="eyebrow mb-6 text-accent">{c.tagline || demoSiteCopy.tagline}</p>
            <h1 className="display-hero max-w-5xl">{c.hero.title || demoSiteCopy.heroTitle}</h1>
            <p className="body-lead mt-7 max-w-2xl opacity-90">
              {c.hero.subtitle || demoSiteCopy.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-3 md:mt-12">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/services">Book Appointment</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-earth-foreground/40 bg-transparent text-earth-foreground hover:bg-earth-foreground/10 hover:text-earth-foreground"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-spa section-space grid items-center gap-12 md:grid-cols-2 lg:gap-20 2xl:gap-28">
        <img
          src={img("asset:aroma")}
          alt="Aromatherapy oils"
          loading="lazy"
          className="image-premium aspect-[4/5] w-full object-cover"
        />
        <div className="md:py-8">
          <SectionHeading eyebrow="About us" title="A modern bathhouse for the soul" />
          <p className="body-copy max-w-2xl text-muted-foreground">
            {c.about.story || demoSiteCopy.aboutStory}
          </p>
          <Button asChild variant="link" className="mt-4 px-0">
            <Link to="/about">Discover more →</Link>
          </Button>
        </div>
      </section>

      <section className="section-space bg-secondary">
        <div className="container-spa">
          <SectionHeading
            center
            eyebrow="Treatments"
            title="Popular rituals"
            text="Select one or several treatments and add them to your booking cart."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8 xl:grid-cols-3">
            {services.isLoading
              ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-[30rem]" />)
              : featuredServices.slice(0, 3).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/services">View all services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-space border-y bg-card/55">
        <div className="container-spa">
          <SectionHeading
            center
            eyebrow="The Salus approach"
            title="A complete journey into stillness"
            text="A thoughtful treatment is more than time on the massage table. Every detail is designed to help you arrive, restore, and return gently to your day."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {wellnessPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="surface-card relative overflow-hidden p-7 lg:p-9"
              >
                <span className="font-display text-5xl text-accent/70">0{index + 1}</span>
                <h3 className="heading-card mt-6">{pillar.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-spa section-space">
        <SectionHeading center eyebrow="Why choose us" title="Care, crafted slowly" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ I, t, d }) => (
            <div
              key={t}
              className="rounded-2xl px-5 py-7 text-center transition-colors hover:bg-card/70 lg:px-7 lg:py-9"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/40">
                <I className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-card">{t}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space bg-earth text-earth-foreground">
        <div className="container-spa">
          <div className="mb-12 lg:mb-16">
            <p className="eyebrow mb-4 text-accent">Our team</p>
            <h2 className="display-section">Meet your therapists</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeam.slice(0, 3).map((m) => (
              <div key={m.id}>
                <img
                  src={img(m.image)}
                  alt={m.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
                <h3 className="mt-4 text-2xl">{m.name}</h3>
                {m.id.startsWith("demo-") && (
                  <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-accent">
                    Demonstration profile
                  </p>
                )}
                <p className="text-sm opacity-70">
                  {m.position} · {m.specialization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-spa section-space">
        <SectionHeading eyebrow="Gallery" title="Moments of calm" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredGallery.slice(0, 4).map((g, i) => (
            <img
              key={g.id}
              src={img(g.image)}
              alt={g.caption}
              loading="lazy"
              className={`h-full w-full rounded-lg object-cover ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`}
            />
          ))}
        </div>
        <Button asChild variant="link" className="mt-6 px-0">
          <Link to="/gallery">See full gallery →</Link>
        </Button>
      </section>

      <section className="container-spa pb-[clamp(4.75rem,7.5vw,8.5rem)]">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-earth px-6 py-16 text-earth-foreground shadow-soft sm:px-10 lg:px-16 lg:py-24">
          <img
            src={img("asset:therapistMassage")}
            alt="A calming professional massage treatment"
            loading="lazy"
            width={1600}
            height={1067}
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-earth/80" />
          <p className="eyebrow mb-4 text-accent">Your time to restore</p>
          <h2 className="display-section max-w-3xl">Leave the noise outside</h2>
          <p className="body-lead mt-5 max-w-2xl opacity-85">
            Choose a treatment, select a time that suits you, and let us shape the details around
            how you want to feel.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/services">Explore treatments</Link>
          </Button>
        </div>
      </section>

      <section className="section-space bg-secondary">
        <div className="container-spa">
          <SectionHeading
            center
            eyebrow="Sample guest stories"
            title="The feeling after"
            text="Demonstration testimonials for presentation only — replace with verified client reviews before launch."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {sampleTestimonials.map((t) => (
              <figure key={t.name} className="surface-card p-7 lg:p-9">
                <div className="mb-4 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="font-display text-xl leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-muted-foreground">
                  — {t.name} · <span className="italic">{t.treatment}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-spa section-space grid gap-12 md:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow="Opening hours" title="Come as you are" />
          <div className="surface-card divide-y overflow-hidden">
            {c.openingHours.map((h) => (
              <div key={h.day} className="flex justify-between px-6 py-4">
                <span>{h.day}</span>
                <span className="text-muted-foreground">{h.hours}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:pl-4 lg:pl-10">
          <SectionHeading eyebrow="Find us" title="Visit the sanctuary" />
          <p className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            {c.contact.address}
          </p>
          <p className="mt-3 flex items-center gap-3 text-muted-foreground">
            <Phone className="h-5 w-5 text-primary" />
            {c.contact.phone}
          </p>
          <Button asChild className="mt-8">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
