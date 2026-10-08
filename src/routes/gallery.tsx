import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageHero } from "@/components/shared";
import { useGallery } from "@/hooks/use-data";
import { img } from "@/lib/images";
import { cn } from "@/lib/utils";
import { demoGallery } from "@/lib/demo-content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Salus Per Aquam" },
      { name: "description", content: "Step inside our treatment suites, rituals and team." },
      { property: "og:title", content: "Gallery — Salus Per Aquam" },
      {
        property: "og:description",
        content: "Photos of our spa interiors, treatments and therapists.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data, isLoading } = useGallery();
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);
  const apiGallery = data?.filter((g) => g.visible) ?? [];
  const visible = apiGallery.length ? apiGallery : demoGallery;
  const showingDemo = !apiGallery.length && !isLoading;
  const cats = ["All", ...new Set(visible.map((g) => g.category))];
  const shown = cat === "All" ? visible : visible.filter((g) => g.category === cat);
  const current = idx !== null ? shown[idx] : null;

  return (
    <main>
      <PageHero
        eyebrow="Gallery"
        title="Step into stillness"
        text="Discover serene spaces, considered details, and restorative rituals designed to make every visit feel like a genuine escape."
        image="asset:room"
      />
      <section className="container-spa section-space">
        {showingDemo && (
          <p className="mb-8 max-w-2xl rounded-2xl border border-accent/50 bg-accent/15 px-5 py-4 text-sm text-foreground/80">
            <strong>Demonstration gallery:</strong> replace these presentation images with verified
            venue and treatment photography through the Admin gallery before launch.
          </p>
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <EmptyState title="No images yet" />
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 2xl:gap-7">
            {shown.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setIdx(i)}
                className="group relative mb-5 block w-full overflow-hidden rounded-2xl bg-muted"
              >
                <img
                  src={img(g.image)}
                  alt={g.caption}
                  loading="lazy"
                  className="w-full transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-veil p-3 text-left text-sm text-earth-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <strong className="block font-display text-xl">{g.title}</strong>
                  <span className="mt-1 block opacity-85">{g.caption}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
      {current && idx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-earth/95 p-4"
          onClick={() => setIdx(null)}
        >
          <button className="absolute right-5 top-5 text-earth-foreground" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <button
            className="absolute left-4 text-earth-foreground"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((idx - 1 + shown.length) % shown.length);
            }}
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <figure className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={img(current.image)}
              alt={current.caption}
              className="max-h-[80vh] rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-earth-foreground">
              {current.caption} <span className="opacity-60">· {current.category}</span>
            </figcaption>
          </figure>
          <button
            className="absolute right-4 text-earth-foreground"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setIdx((idx + 1) % shown.length);
            }}
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </main>
  );
}
