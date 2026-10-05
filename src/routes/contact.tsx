import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PageHero } from "@/components/shared";
import { useContent } from "@/hooks/use-data";
import { contactSchema, type ContactValues } from "@/schemas";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Salus Per Aquam" },
      { name: "description", content: "Address, phone, opening hours and a contact form for Salus Per Aquam spa." },
      { property: "og:title", content: "Contact — Salus Per Aquam" },
      { property: "og:description", content: "Get in touch or visit our massage sanctuary." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: c } = useContent();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });
  if (!c) return null;
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Thank you — we'll reply shortly.");
    reset();
  };
  return (
    <main>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" image="asset:aroma" />
      <section className="container-spa grid gap-12 py-20 md:grid-cols-2">
        <div className="space-y-6">
          {[{ I: MapPin, v: c.contact.address }, { I: Phone, v: c.contact.phone }, { I: Mail, v: c.contact.email }].map(({ I, v }) => (
            <p key={v} className="flex items-center gap-4"><span className="rounded-full bg-accent/40 p-3"><I className="h-5 w-5 text-primary" /></span>{v}</p>
          ))}
          <div className="flex gap-4">
            <span className="h-fit rounded-full bg-accent/40 p-3"><Clock className="h-5 w-5 text-primary" /></span>
            <div>{c.openingHours.map((h) => <p key={h.day}>{h.day}: <span className="text-muted-foreground">{h.hours}</span></p>)}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg bg-card p-8 shadow-soft">
          <Field label="Name" error={errors.name?.message}><Input {...register("name")} /></Field>
          <Field label="Email" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
          <Field label="Message" error={errors.message?.message}><Textarea rows={5} {...register("message")} /></Field>
          <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Sending…" : "Send message"}</Button>
        </form>
      </section>
    </main>
  );
}
