import { useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPage } from "./admin-shell";
import { ConfirmDialog, EmptyState, Spinner } from "./shared";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { useAction, useAdminGallery, useAdminServices, useAdminTeam, keys } from "@/hooks/use-data";
import { galleryService, servicesService, teamService } from "@/services/catalog.service";
import { img } from "@/lib/images";
import type { GalleryItem, Service, TeamMember } from "@/types";
type Kind = "services" | "team" | "gallery";
type Item = Service | TeamMember | GalleryItem;
const empty: Record<Kind, Record<string, unknown>> = {
  services: { name: "", category: "", description: "", duration: 60, price: 0, active: true },
  team: { name: "", position: "", specialization: "", experience: 0, bio: "", active: true },
  gallery: { title: "", caption: "", category: "", visible: true },
};
export function CatalogAdmin({ kind }: { kind: Kind }) {
  const qs = { services: useAdminServices(), team: useAdminTeam(), gallery: useAdminGallery() };
  const q = qs[kind];
  const svc = { services: servicesService, team: teamService, gallery: galleryService }[kind];
  const [editing, setEditing] = useState<Item | null | undefined>(undefined);
  const mutation = useAction(
    async ({ item, data }: { item: Item | null; data: Record<string, unknown> }) =>
      item ? svc.update(item.id, data as never) : svc.create(data as never),
    {
      success: `${kind === "team" ? "Team member" : kind.slice(0, -1)} saved`,
      invalidate: [
        [
          ...{ services: keys.adminServices, team: keys.adminTeam, gallery: keys.adminGallery }[
            kind
          ],
        ],
        [kind],
      ],
    },
  );
  const remove = useAction((id: string) => svc.remove(id), {
    success: "Item deleted",
    invalidate: [
      [...{ services: keys.adminServices, team: keys.adminTeam, gallery: keys.adminGallery }[kind]],
      [kind],
    ],
  });
  const title = { services: "Services", team: "Team / Therapists", gallery: "Gallery" }[kind];
  if (q.isLoading) return <Spinner />;
  return (
    <AdminPage
      title={title}
      description={`Manage the ${title.toLowerCase()} shown on the public website.`}
      action={
        <Button onClick={() => setEditing(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      }
    >
      {!q.data?.length ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(q.data as Item[]).map((item) => (
            <div key={item.id} className="surface-card overflow-hidden">
              <img src={img(item.image)} className="h-48 w-full object-cover 2xl:h-56" alt="" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="heading-card">
                      {"name" in item ? item.name : item.title || item.caption}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {"category" in item ? item.category : item.position}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${("active" in item && item.active) || ("visible" in item && item.visible) ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
                  >
                    {("active" in item && item.active) || ("visible" in item && item.visible)
                      ? "Active"
                      : "Hidden"}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button size="sm" variant="outline">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    }
                    title="Delete item?"
                    text="This also removes its uploaded image."
                    onConfirm={() => remove.mutate(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing !== undefined && (
        <ItemForm
          kind={kind}
          item={editing}
          close={() => setEditing(undefined)}
          save={(data) =>
            mutation.mutate({ item: editing, data }, { onSuccess: () => setEditing(undefined) })
          }
          busy={mutation.isPending}
        />
      )}
    </AdminPage>
  );
}
function ItemForm({
  kind,
  item,
  close,
  save,
  busy,
}: {
  kind: Kind;
  item: Item | null;
  close: () => void;
  save: (d: Record<string, unknown>) => void;
  busy: boolean;
}) {
  const [data, setData] = useState<Record<string, unknown>>(item ? { ...item } : empty[kind]);
  const set = (k: string, v: unknown) => setData((x) => ({ ...x, [k]: v }));
  const activeKey = kind === "gallery" ? "visible" : "active";
  const fields: ReadonlyArray<readonly [string, string]> =
    kind === "services"
      ? [
          ["name", "Name"],
          ["category", "Category"],
          ["duration", "Duration (minutes)"],
          ["price", "Price"],
        ]
      : kind === "team"
        ? [
            ["name", "Name"],
            ["position", "Position"],
            ["specialization", "Specialization"],
            ["experience", "Years of experience"],
          ]
        : [
            ["title", "Title"],
            ["caption", "Caption"],
            ["category", "Category"],
          ];
  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit" : "Add"} {kind === "team" ? "therapist" : kind.slice(0, -1)}
          </DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!item && !data["image"]) return;
            save(data);
          }}
        >
          {fields.map(([k, l]) => (
            <label className="text-sm" key={k}>
              {l}
              <Input
                required={k !== "title"}
                type={["duration", "price", "experience"].includes(k) ? "number" : "text"}
                value={String(data[k] ?? "")}
                onChange={(e) =>
                  set(
                    k,
                    ["duration", "price", "experience"].includes(k)
                      ? Number(e.target.value)
                      : e.target.value,
                  )
                }
              />
            </label>
          ))}
          {kind === "services" && (
            <label className="text-sm sm:col-span-2">
              Description
              <Textarea
                required
                value={String(data["description"] ?? "")}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
          )}
          {kind === "team" && (
            <label className="text-sm sm:col-span-2">
              Biography
              <Textarea
                required
                value={String(data["bio"] ?? "")}
                onChange={(e) => set("bio", e.target.value)}
              />
            </label>
          )}
          <label className="flex cursor-pointer items-center gap-3 rounded border border-dashed p-3 sm:col-span-2">
            <ImagePlus className="h-5 w-5" />
            <span className="text-sm">
              {data["image"] ? "Replace image" : "Choose image (required)"}
            </span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && set("image", e.target.files[0])}
            />
          </label>
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <Switch checked={Boolean(data[activeKey])} onCheckedChange={(v) => set(activeKey, v)} />
            Visible on public website
          </label>
          <Button disabled={busy || (!item && !data["image"])} className="sm:col-span-2">
            {busy ? "Saving…" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
