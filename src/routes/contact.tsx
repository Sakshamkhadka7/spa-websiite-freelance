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
      {
        name: "description",
        content: "Address, phone, opening hours and a contact form for Salus Per Aquam spa.",
      },
      { property: "og:title", content: "Contact — Salus Per Aquam" },
      { property: "og:description", content: "Get in touch or visit our massage sanctuary." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: c } = useContent();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });
  if (!c) return null;
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Thank you — we'll reply shortly.");
    reset();
  };
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Your journey to relaxation begins here"
        text="Whether you are choosing your first treatment or planning a return visit, we are here to make the experience feel simple and personal."
        image="asset:aroma"
      />
      <section className="container-spa section-space grid gap-12 md:grid-cols-2 lg:gap-20">
        <div className="space-y-7 text-[1.05rem] lg:pt-4">
          <div className="mb-9">
            <p className="eyebrow mb-3">Plan your visit</p>
            <h2 className="display-section">A quiet moment starts here</h2>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Ask about treatments, accessibility, therapist preferences, or preparing for your
              first visit. We will help you choose an experience that feels right for you.
            </p>
          </div>
          {[
            { I: MapPin, v: c.contact.address },
            { I: Phone, v: c.contact.phone },
            { I: Mail, v: c.contact.email },
          ].map(({ I, v }) => (
            <p key={v} className="flex items-center gap-4">
              <span className="rounded-full bg-accent/40 p-3">
                <I className="h-5 w-5 text-primary" />
              </span>
              {v}
            </p>
          ))}
          <div className="flex gap-4">
            <span className="h-fit rounded-full bg-accent/40 p-3">
              <Clock className="h-5 w-5 text-primary" />
            </span>
            <div>
              {c.openingHours.map((h) => (
                <p key={h.day}>
                  {h.day}: <span className="text-muted-foreground">{h.hours}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="surface-card space-y-5 p-6 sm:p-8 lg:p-10"
        >
          <div className="border-b pb-5">
            <p className="eyebrow mb-2">Send an enquiry</p>
            <h2 className="heading-card">How can we help?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Share your question or preferred experience. Please avoid including sensitive health
              information in this general enquiry form.
            </p>
          </div>
          <Field label="Name" error={errors.name?.message}>
            <Input {...register("name")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <Textarea rows={5} {...register("message")} />
          </Field>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </main>
  );
}
