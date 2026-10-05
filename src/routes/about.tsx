import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageHero, SectionHeading } from "@/components/shared";
import { useContent, useTeam } from "@/hooks/use-data";
import { img } from "@/lib/images";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Salus Per Aquam" },
      { name: "description", content: "Our story, mission, values, facilities and the therapists behind Salus Per Aquam." },
      { property: "og:title", content: "About Us — Salus Per Aquam" },
      { property: "og:description", content: "Meet the therapists and philosophy behind our massage sanctuary." },
    ],
  }),
  component: About,
});

function About() {
  const { data: c } = useContent();
  const team = useTeam();
  if (!c) return null;
  return (
    <main>
      <PageHero eyebrow="About us" title="Our story" text={c.tagline} image="asset:room" />
      <section className="container-spa grid gap-12 py-24 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Story" title="Rooted in ritual" />
          <p className="text-muted-foreground">{c.about.story}</p>
        </div>
        <div className="rounded-lg bg-earth p-10 text-earth-foreground">
          <p className="eyebrow mb-3 text-accent">Mission</p>
          <p className="font-display text-3xl leading-snug">{c.about.mission}</p>
        </div>
      </section>
      <section className="bg-secondary py-24">
        <div className="container-spa grid gap-12 md:grid-cols-2">
          {[{ t: "Our values", l: c.about.values }, { t: "Facilities", l: c.about.facilities }].map((b) => (
            <div key={b.t}>
              <h2 className="mb-6 text-4xl">{b.t}</h2>
              <ul className="space-y-3">
                {b.l.map((v) => <li key={v} className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" />{v}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="container-spa py-24">
        <SectionHeading eyebrow="Team" title="Our therapists" />
        {team.isLoading ? (
          <div className="grid gap-8 md:grid-cols-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-96" />)}</div>
        ) : !team.data?.length ? (
          <EmptyState title="Team coming soon" />
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.data.map((m) => (
              <article key={m.id}>
                <img src={img(m.image)} alt={m.name} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover shadow-soft" />
                <h3 className="mt-5 text-3xl">{m.name}</h3>
                <p className="eyebrow mt-1">{m.position}</p>
                <p className="mt-2 text-sm"><span className="text-muted-foreground">Specialization:</span> {m.specialization}</p>
                <p className="text-sm"><span className="text-muted-foreground">Experience:</span> {m.experience} years</p>
                <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
