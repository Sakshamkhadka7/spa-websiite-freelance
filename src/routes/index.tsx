import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Clock, Leaf, MapPin, Phone, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/shared";
import { ServiceCard } from "@/components/service-card";
import { useContent, useGallery, useServices, useTeam } from "@/hooks/use-data";
import { img } from "@/lib/images";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salus Per Aquam — Luxury Massage & Spa" },
      { name: "description", content: "Return to stillness. Book Swedish, deep tissue, hot stone and aromatherapy massage at Salus Per Aquam." },
      { property: "og:title", content: "Salus Per Aquam — Luxury Massage & Spa" },
      { property: "og:description", content: "Massage rituals crafted to restore body and mind." },
    ],
  }),
  component: Home,
});

const why = [
  { I: Award, t: "Certified therapists", d: "Every therapist is trained, licensed and deeply experienced." },
  { I: Leaf, t: "Natural ingredients", d: "Organic oils and botanicals, blended in-house." },
  { I: Sparkles, t: "Tailored rituals", d: "Pressure, scent and focus adapted to you." },
  { I: Clock, t: "Unhurried time", d: "No rushing — every treatment ends with tea and rest." },
];

const testimonials = [
  { n: "Sophie L.", q: "The hot stone ritual was the deepest rest I've had in years. Truly a sanctuary." },
  { n: "Arjun P.", q: "Daniel worked out a shoulder knot I've carried for months. Exceptional skill." },
  { n: "Hannah & Tom", q: "Our couples massage was serene, romantic and perfectly calm." },
];

function Home() {
  const { data: c } = useContent();
  const services = useServices();
  const team = useTeam();
  const gallery = useGallery();
  if (!c) return null;

  return (
    <main>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <img src={img(c.hero.image)} alt="Spa treatment room" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-veil" />
        <div className="container-spa relative text-earth-foreground">
          <div className="max-w-2xl fade-up">
            <p className="eyebrow mb-5 text-accent">{c.tagline}</p>
            <h1 className="text-6xl leading-[0.95] md:text-8xl">{c.hero.title}</h1>
            <p className="mt-6 max-w-lg text-lg opacity-90">{c.hero.subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/services">Book Appointment</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-earth-foreground/40 bg-transparent text-earth-foreground hover:bg-earth-foreground/10 hover:text-earth-foreground"><Link to="/about">Our Story</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-spa grid items-center gap-12 py-24 md:grid-cols-2">
        <img src={img("asset:aroma")} alt="Aromatherapy oils" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover shadow-soft" />
        <div>
          <SectionHeading eyebrow="About us" title="A modern bathhouse for the soul" />
          <p className="text-muted-foreground">{c.about.story}</p>
          <Button asChild variant="link" className="mt-4 px-0"><Link to="/about">Discover more →</Link></Button>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="container-spa">
          <SectionHeading center eyebrow="Treatments" title="Popular rituals" text="Select one or several treatments and add them to your booking cart." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.isLoading
              ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-[30rem]" />)
              : services.data?.filter((s) => s.active).slice(0, 3).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
          <div className="mt-12 text-center"><Button asChild variant="outline"><Link to="/services">View all services</Link></Button></div>
        </div>
      </section>

      <section className="container-spa py-24">
        <SectionHeading center eyebrow="Why choose us" title="Care, crafted slowly" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ I, t, d }) => (
            <div key={t} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/40"><I className="h-6 w-6 text-primary" /></div>
              <h3 className="text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-earth py-24 text-earth-foreground">
        <div className="container-spa">
          <div className="mb-12"><p className="eyebrow mb-3 text-accent">Our team</p><h2 className="text-4xl md:text-5xl">Meet your therapists</h2></div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.data?.slice(0, 3).map((m) => (
              <div key={m.id}>
                <img src={img(m.image)} alt={m.name} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
                <h3 className="mt-4 text-2xl">{m.name}</h3>
                <p className="text-sm opacity-70">{m.position} · {m.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-spa py-24">
        <SectionHeading eyebrow="Gallery" title="Moments of calm" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.data?.filter((g) => g.visible).slice(0, 4).map((g, i) => (
            <img key={g.id} src={img(g.image)} alt={g.caption} loading="lazy" className={`h-full w-full rounded-lg object-cover ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-square"}`} />
          ))}
        </div>
        <Button asChild variant="link" className="mt-6 px-0"><Link to="/gallery">See full gallery →</Link></Button>
      </section>

      <section className="bg-secondary py-24">
        <div className="container-spa">
          <SectionHeading center eyebrow="Kind words" title="From our guests" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.n} className="rounded-lg bg-card p-8 shadow-soft">
                <div className="mb-4 flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <blockquote className="font-display text-xl leading-snug">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">— {t.n}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-spa grid gap-12 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Opening hours" title="Come as you are" />
          <div className="divide-y rounded-lg border bg-card">
            {c.openingHours.map((h) => (
              <div key={h.day} className="flex justify-between px-6 py-4"><span>{h.day}</span><span className="text-muted-foreground">{h.hours}</span></div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Find us" title="Visit the sanctuary" />
          <p className="flex items-center gap-3 text-muted-foreground"><MapPin className="h-5 w-5 text-primary" />{c.contact.address}</p>
          <p className="mt-3 flex items-center gap-3 text-muted-foreground"><Phone className="h-5 w-5 text-primary" />{c.contact.phone}</p>
          <Button asChild className="mt-8"><Link to="/contact">Contact us</Link></Button>
        </div>
      </section>
    </main>
  );
}
