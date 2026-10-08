import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero, SectionHeading } from "@/components/shared";
import { useContent, useTeam } from "@/hooks/use-data";
import { img } from "@/lib/images";
import { demoSiteCopy, demoTeam, wellnessPillars } from "@/lib/demo-content";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Salus Per Aquam" },
      {
        name: "description",
        content:
          "Our story, mission, values, facilities and the therapists behind Salus Per Aquam.",
      },
      { property: "og:title", content: "About Us — Salus Per Aquam" },
      {
        property: "og:description",
        content: "Meet the therapists and philosophy behind our massage sanctuary.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { data: c } = useContent();
  const team = useTeam();
  if (!c) return null;
  const publicTeam = team.data?.filter((member) => member.active) ?? [];
  const displayedTeam = publicTeam.length ? publicTeam : demoTeam;
  return (
    <main>
      <PageHero
        eyebrow="About us"
        title="Our story"
        text={c.tagline || demoSiteCopy.tagline}
        image="asset:room"
      />
      <section className="container-spa section-space grid gap-12 md:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow="Story" title="Rooted in ritual" />
          <p className="body-copy text-muted-foreground">
            {c.about.story || demoSiteCopy.aboutStory}
          </p>
        </div>
        <div className="rounded-2xl bg-earth p-8 text-earth-foreground shadow-soft md:p-10 xl:p-14">
          <p className="eyebrow mb-3 text-accent">Mission</p>
          <p className="font-display text-[clamp(2rem,3vw,3.5rem)] leading-[1.08]">
            {c.about.mission || demoSiteCopy.mission}
          </p>
          <div className="mt-10 border-t border-earth-foreground/15 pt-8">
            <p className="eyebrow mb-3 text-accent">Vision</p>
            <p className="text-lg leading-relaxed opacity-85">{demoSiteCopy.vision}</p>
          </div>
        </div>
      </section>
      <section className="container-spa section-space grid items-center gap-12 md:grid-cols-2 lg:gap-20">
        <div className="md:order-2">
          <SectionHeading eyebrow="Wellness philosophy" title="Care for the whole person" />
          <p className="body-copy text-muted-foreground">
            We believe meaningful wellbeing begins by slowing down. Our approach brings together
            skilled touch, natural sensory elements, attentive listening, and enough time for the
            body and mind to settle without being rushed.
          </p>
          <div className="mt-8 space-y-5">
            {wellnessPillars.map((pillar) => (
              <div key={pillar.title} className="border-l-2 border-accent pl-5">
                <h3 className="font-display text-2xl">{pillar.title}</h3>
                <p className="mt-1 text-muted-foreground">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
        <img
          src={img("asset:spaInterior")}
          alt="A calming holistic treatment ritual"
          loading="lazy"
          width={1400}
          height={1050}
          className="image-premium aspect-[4/5] w-full object-cover md:order-1"
        />
      </section>
      <section className="section-space bg-secondary">
        <div className="container-spa grid gap-12 md:grid-cols-2 lg:gap-24">
          {[
            { t: "Our values", l: c.about.values },
            { t: "Facilities", l: c.about.facilities },
          ].map((b) => (
            <div key={b.t}>
              <h2 className="display-section mb-8">{b.t}</h2>
              <ul className="space-y-4 text-[1.05rem]">
                {b.l.map((v) => (
                  <li key={v} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="container-spa section-space">
        <SectionHeading eyebrow="Team" title="Our therapists" />
        {team.isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-12">
            {displayedTeam.map((m) => (
              <article key={m.id}>
                <img
                  src={img(m.image)}
                  alt={m.name}
                  loading="lazy"
                  className="image-premium aspect-[4/5] w-full object-cover"
                />
                <h3 className="heading-card mt-6">{m.name}</h3>
                {m.id.startsWith("demo-") && (
                  <span className="mt-3 inline-flex rounded-full bg-accent/35 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider">
                    Demonstration profile
                  </span>
                )}
                <p className="eyebrow mt-1">{m.position}</p>
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Specialization:</span> {m.specialization}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Experience:</span> {m.experience} years
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">{m.bio}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
