import { useEffect, useState, type ReactNode } from "react";
import { ImagePlus, Inbox } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { img } from "@/lib/images";
import type { BookingStatus, ImageInput, PaymentStatus } from "@/types";

export function SectionHeading({ eyebrow, title, text, center }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={cn("mb-12 max-w-2xl", center && "mx-auto text-center")}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text?: string; image: string }) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden">
      <img src={img(image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-veil" />
      <div className="container-spa relative pb-14 pt-32 text-earth-foreground fade-up">
        <p className="eyebrow mb-3 text-accent">{eyebrow}</p>
        <h1 className="text-5xl md:text-6xl">{title}</h1>
        {text && <p className="mt-4 max-w-xl opacity-90">{text}</p>}
      </div>
    </section>
  );
}

export function Field({ label, error, children, className }: { label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed bg-card/50 px-6 py-14 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
      <p className="font-display text-2xl">{title}</p>
      {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

const bookingTone: Record<BookingStatus, string> = {
  pending: "bg-warning/15 text-warning border-warning/30",
  contacted: "bg-info/15 text-info border-info/30",
  confirmed: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", bookingTone[status])}>{status}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
      status === "paid" ? "bg-success/15 text-success border-success/30" : "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
}

export function ConfirmDialog({ trigger, title, text, onConfirm, confirmLabel = "Delete" }: {
  trigger: ReactNode; title: string; text: string; onConfirm: () => void; confirmLabel?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{text}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Image picker with preview. Value is an existing URL or a newly selected File. */
export function ImageField({ value, onChange, error }: { value: ImageInput | undefined; onChange: (v: ImageInput) => void; error?: string }) {
  const [preview, setPreview] = useState<string>("");
  useEffect(() => {
    if (!value) return setPreview("");
    if (typeof value === "string") return setPreview(img(value));
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);
  return (
    <Field label="Image" error={error}>
      <label className="flex cursor-pointer items-center gap-4 rounded-md border border-dashed p-3 hover:bg-muted/50">
        {preview ? (
          <img src={preview} alt="Preview" className="h-20 w-20 rounded object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded bg-muted"><ImagePlus className="h-6 w-6 text-muted-foreground" /></div>
        )}
        <span className="text-sm text-muted-foreground">{preview ? "Click to replace image" : "Click to upload image"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onChange(f);
        }} />
      </label>
    </Field>
  );
}

export function Spinner() {
  return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
}
