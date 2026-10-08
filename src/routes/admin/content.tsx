import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin-shell";
import { Spinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContent, keys, useAction } from "@/hooks/use-data";
import { contentService } from "@/services/catalog.service";
import { img } from "@/lib/images";
import type { SiteContent } from "@/types";
export const Route = createFileRoute("/admin/content")({ component: Content });
function Content() {
  const q = useContent();
  const [form, setForm] = useState<SiteContent | null>(null),
    [hero, setHero] = useState<File>(),
    [logo, setLogo] = useState<File>();
  useEffect(() => {
    if (q.data) setForm(structuredClone(q.data));
  }, [q.data]);
  const save = useAction((c: SiteContent) => contentService.update(c, hero, logo), {
    success: "Website content updated",
    invalidate: [keys.content],
  });
  if (!form) return <Spinner />;
  const set = (path: string, value: unknown) =>
    setForm((prev) => {
      const n = structuredClone(prev!);
      const parts = path.split(".");
      let x: Record<string, unknown> = n as unknown as Record<string, unknown>;
      parts.slice(0, -1).forEach((k) => (x = x[k] as Record<string, unknown>));
      x[parts.at(-1)!] = value;
      return n;
    });
  return (
    <AdminPage
      title="Website Content"
      description="Changes publish to the public website after saving."
    >
      <form
        className="grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
      >
        <Section title="Brand & hero">
          <Field label="SPA name" value={form.spaName} set={(v) => set("spaName", v)} />
          <Field label="Logo text" value={form.logoText} set={(v) => set("logoText", v)} />
          <Field label="Tagline" value={form.tagline} set={(v) => set("tagline", v)} />
          <Field label="Hero title" value={form.hero.title} set={(v) => set("hero.title", v)} />
          <Field
            label="Hero subtitle"
            value={form.hero.subtitle}
            set={(v) => set("hero.subtitle", v)}
          />
          <Upload label="Logo image" current={form.logo} set={setLogo} />
          <Upload label="Home page hero image" current={form.hero.image} set={setHero} />
        </Section>
        <Section title="About">
          <Area label="About us" value={form.about.story} set={(v) => set("about.story", v)} />
          <Area label="Mission" value={form.about.mission} set={(v) => set("about.mission", v)} />
          <ListEditor
            label="Values"
            values={form.about.values}
            placeholder="e.g. Personalized care"
            set={(values) => set("about.values", values)}
          />
          <ListEditor
            label="Facilities"
            values={form.about.facilities}
            placeholder="e.g. Private treatment rooms"
            set={(values) => set("about.facilities", values)}
          />
        </Section>
        <Section title="Contact & footer">
          <Field label="Phone" value={form.contact.phone} set={(v) => set("contact.phone", v)} />
          <Field label="Email" value={form.contact.email} set={(v) => set("contact.email", v)} />
          <Field
            label="Address"
            value={form.contact.address}
            set={(v) => set("contact.address", v)}
          />
          <Field
            label="Facebook"
            value={form.social.facebook}
            set={(v) => set("social.facebook", v)}
          />
          <Field
            label="Instagram"
            value={form.social.instagram}
            set={(v) => set("social.instagram", v)}
          />
          <Field
            label="Twitter"
            value={form.social.twitter}
            set={(v) => set("social.twitter", v)}
          />
          <Area label="Footer content" value={form.footerText} set={(v) => set("footerText", v)} />
          <Field label="Currency symbol" value={form.currency} set={(v) => set("currency", v)} />
          <ListEditor
            label="Booking time slots"
            values={form.timeSlots}
            placeholder="e.g. 09:00 AM"
            set={(values) => set("timeSlots", values)}
          />
          <HoursEditor values={form.openingHours} set={(values) => set("openingHours", values)} />
        </Section>
        <Button className="w-fit" disabled={save.isPending}>
          {save.isPending ? "Publishing…" : "Publish changes"}
        </Button>
      </form>
    </AdminPage>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card grid gap-4 p-6 md:grid-cols-2 lg:p-8">
      <h2 className="heading-card md:col-span-2">{title}</h2>
      {children}
    </section>
  );
}
function Field({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <label className="text-sm">
      {label}
      <Input value={value ?? ""} onChange={(e) => set(e.target.value)} />
    </label>
  );
}
function Area({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <label className="text-sm md:col-span-2">
      {label}
      <Textarea rows={4} value={value ?? ""} onChange={(e) => set(e.target.value)} />
    </label>
  );
}
function ListEditor({
  label,
  values,
  placeholder,
  inputType = "text",
  set,
}: {
  label: string;
  values: string[];
  placeholder: string;
  inputType?: "text" | "time";
  set: (values: string[]) => void;
}) {
  const rows = values.length ? values : [""];
  const update = (index: number, value: string) => {
    const next = [...rows];
    next[index] = value;
    set(next);
  };
  return (
    <div className="space-y-2 md:col-span-2">
      <p className="text-sm">{label}</p>
      {rows.map((value, index) => (
        <div className="flex gap-2" key={`${label}-${index}`}>
          <Input
            type={inputType}
            value={value}
            placeholder={placeholder}
            onChange={(e) => update(index, e.target.value)}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={`Remove ${label} row`}
            onClick={() => set(rows.filter((_, row) => row !== index))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => set([...rows, ""])}>
        <Plus className="mr-2 h-4 w-4" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

function HoursEditor({
  values,
  set,
}: {
  values: SiteContent["openingHours"];
  set: (values: SiteContent["openingHours"]) => void;
}) {
  const rows = values.length ? values : [{ day: "", hours: "" }];
  const update = (index: number, key: "day" | "hours", value: string) => {
    const next = rows.map((row, current) => (current === index ? { ...row, [key]: value } : row));
    set(next);
  };
  return (
    <div className="space-y-2 md:col-span-2">
      <p className="text-sm">Opening hours</p>
      {rows.map((row, index) => (
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2" key={`hours-${index}`}>
          <Input
            value={row.day}
            placeholder="Day, e.g. Monday"
            onChange={(e) => update(index, "day", e.target.value)}
          />
          <Input
            value={row.hours}
            placeholder="Hours, e.g. 9 AM – 7 PM"
            onChange={(e) => update(index, "hours", e.target.value)}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Remove opening-hours row"
            onClick={() => set(rows.filter((_, current) => current !== index))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => set([...rows, { day: "", hours: "" }])}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add opening hours
      </Button>
    </div>
  );
}

function Upload({
  label,
  current,
  set,
}: {
  label: string;
  current?: string;
  set: (f: File) => void;
}) {
  const [preview, setPreview] = useState(current ? img(current) : "");
  return (
    <label className="space-y-2 text-sm">
      {label}
      {preview && (
        <img
          src={preview}
          alt={`${label} preview`}
          className="h-36 w-full rounded-md border object-cover"
        />
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          set(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </label>
  );
}
