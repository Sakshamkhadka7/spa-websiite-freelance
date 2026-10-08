import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageHero, SectionHeading } from "@/components/shared";
import { ServiceCard } from "@/components/service-card";
import { useServices } from "@/hooks/use-data";
import { cn } from "@/lib/utils";
import { demoServices, treatmentGuide } from "@/lib/demo-content";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Massage Services & Prices — Salus Per Aquam" },
      {
        name: "description",
        content:
          "Swedish, deep tissue, aromatherapy, hot stone, Thai, couples, head & shoulder and foot massage.",
      },
      { property: "og:title", content: "Massage Services — Salus Per Aquam" },
      { property: "og:description", content: "Browse our massage menu and book online." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data, isLoading } = useServices();
  const [cat, setCat] = useState("All");
  const apiServices = data?.filter((s) => s.active) ?? [];
  const active = apiServices.length ? apiServices : demoServices;
  const showingDemo = !apiServices.length && !isLoading;
  const cats = ["All", ...new Set(active.map((s) => s.category))];
  const shown = cat === "All" ? active : active.filter((s) => s.category === cat);

  return (
    <main>
      <PageHero
        eyebrow="Treatments"
        title="Restore your balance. Renew your energy."
        text="Explore massage, facial, and botanical rituals, then choose the experience that best matches how you want to feel."
        image="asset:hotstone"
      />
      <section className="container-spa section-space">
        {showingDemo && (
          <div className="mb-8 rounded-2xl border border-accent/50 bg-accent/15 px-5 py-4 text-sm text-foreground/80">
            <strong>Presentation menu:</strong> these sample treatments appear only because no
            active services were returned. Add services in Admin to replace them and enable booking.
          </div>
        )}
        <div className="mb-10 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-11 rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card/50 hover:bg-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[30rem]" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <EmptyState title="No treatments in this category" text="Choose another category." />
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-9">
            {shown.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>
      <section className="section-space border-t bg-secondary">
        <div className="container-spa">
          <SectionHeading
            center
            eyebrow="Find your ritual"
            title="Not sure where to begin?"
            text="Use these simple intentions as a starting point. Treatment suitability and preferences can be discussed when you book."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {treatmentGuide.map((item, index) => (
              <article key={item.title} className="surface-card p-7 lg:p-9">
                <span className="eyebrow">Intention 0{index + 1}</span>
                <h2 className="heading-card mt-5">{item.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
