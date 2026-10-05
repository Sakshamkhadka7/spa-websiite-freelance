import { api, resolveImageInput, toFormData, USE_MOCK } from "@/lib/api";
import { db, delay, persist, uid } from "@/lib/mock-db";
import type { GalleryItem, ImageInput, Service, SiteContent, TeamMember } from "@/types";

type WithImage<T> = Omit<T, "id" | "image"> & { image: ImageInput };
export type ServiceInput = WithImage<Service>;
export type TeamInput = WithImage<TeamMember>;
export type GalleryInput = WithImage<GalleryItem>;

type Collection = "services" | "team" | "gallery";

/** Generic CRUD that maps to REST: GET/POST /{path}, PUT/DELETE /{path}/:id (multipart for images). */
function crud<T extends { id: string; image: string }>(key: Collection, path: string) {
  const list = () => db()[key] as unknown as T[];
  return {
    async list(): Promise<T[]> {
      if (!USE_MOCK) return (await api.get<T[]>(path)).data;
      await delay();
      return [...list()];
    },
    async create(input: WithImage<T>): Promise<T> {
      if (!USE_MOCK) return (await api.post<T>(path, toFormData(input))).data;
      await delay();
      const item = { ...input, id: uid(), image: await resolveImageInput(input.image) } as unknown as T;
      list().unshift(item);
      persist();
      return item;
    },
    async update(id: string, input: Partial<WithImage<T>>): Promise<T> {
      if (!USE_MOCK) return (await api.put<T>(`${path}/${id}`, toFormData(input))).data;
      await delay();
      const item = list().find((x) => x.id === id);
      if (!item) throw new Error("Not found");
      const { image, ...rest } = input;
      Object.assign(item, rest);
      if (image !== undefined) item.image = await resolveImageInput(image);
      persist();
      return item;
    },
    async remove(id: string): Promise<void> {
      if (!USE_MOCK) { await api.delete(`${path}/${id}`); return; }
      await delay();
      const arr = list();
      arr.splice(arr.findIndex((x) => x.id === id), 1);
      persist();
    },
  };
}

export const servicesService = crud<Service>("services", "/services");
export const teamService = crud<TeamMember>("team", "/team");
export const galleryService = crud<GalleryItem>("gallery", "/gallery");

export const contentService = {
  // GET /content
  async get(): Promise<SiteContent> {
    if (!USE_MOCK) return (await api.get<SiteContent>("/content")).data;
    await delay(150);
    return structuredClone(db().content);
  },
  // PUT /content
  async update(input: SiteContent, heroImage?: File): Promise<SiteContent> {
    if (!USE_MOCK) return (await api.put<SiteContent>("/content", toFormData({ ...input, heroImage }))).data;
    await delay();
    const next = { ...input, hero: { ...input.hero, image: heroImage ? await resolveImageInput(heroImage) : input.hero.image } };
    db().content = next;
    persist();
    return next;
  },
};
