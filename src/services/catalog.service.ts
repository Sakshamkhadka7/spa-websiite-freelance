import { api, toFormData } from "@/lib/api";
import type { GalleryItem, ImageInput, Service, SiteContent, TeamMember } from "@/types";
type WithImage<T> = Omit<T, "id" | "image"> & { image: ImageInput };
export type ServiceInput = WithImage<Service>;
export type TeamInput = WithImage<TeamMember>;
export type GalleryInput = WithImage<GalleryItem>;
function crud<T extends { id: string; image: string }>(path: string) {
  return {
    async list(): Promise<T[]> {
      return (await api.get<T[]>(path, { params: { limit: 100 } })).data;
    },
    async listAll(): Promise<T[]> {
      return (await api.get<T[]>(`${path}/admin/all`, { params: { limit: 100 } })).data;
    },
    async create(input: WithImage<T>): Promise<T> {
      return (await api.post<T>(path, toFormData(input))).data;
    },
    async update(id: string, input: Partial<WithImage<T>>): Promise<T> {
      return (await api.put<T>(`${path}/${id}`, toFormData(input))).data;
    },
    async remove(id: string): Promise<void> {
      await api.delete(`${path}/${id}`);
    },
  };
}
export const servicesService = crud<Service>("/services");
export const teamService = crud<TeamMember>("/team");
export const galleryService = {
  ...crud<GalleryItem>("/gallery"),
  async createMany(files: File[], input: Partial<GalleryInput>): Promise<GalleryItem[]> {
    const data = toFormData(input);
    files.forEach((file) => data.append("images", file));
    return (await api.post<GalleryItem[]>("/gallery/multiple", data)).data;
  },
};

function normalizeContent(value: Partial<SiteContent>): SiteContent {
  return {
    spaName: value.spaName || "Salus Per Aquam",
    logoText: value.logoText || value.spaName || "Salus Per Aquam",
    logo: value.logo || "",
    tagline: value.tagline || "",
    hero: {
      title: value.hero?.title || "",
      subtitle: value.hero?.subtitle || "",
      image: value.hero?.image || "",
    },
    about: {
      story: value.about?.story || "",
      mission: value.about?.mission || "",
      values: Array.isArray(value.about?.values) ? value.about.values : [],
      facilities: Array.isArray(value.about?.facilities) ? value.about.facilities : [],
    },
    contact: {
      phone: value.contact?.phone || "",
      email: value.contact?.email || "",
      address: value.contact?.address || "",
    },
    openingHours: Array.isArray(value.openingHours) ? value.openingHours : [],
    social: {
      facebook: value.social?.facebook || "",
      instagram: value.social?.instagram || "",
      twitter: value.social?.twitter || "",
    },
    footerText: value.footerText || "",
    currency: value.currency || "$",
    timeSlots: Array.isArray(value.timeSlots) ? value.timeSlots : [],
  };
}

export const contentService = {
  async get(): Promise<SiteContent> {
    return normalizeContent((await api.get<Partial<SiteContent>>("/website")).data);
  },
  async update(input: SiteContent, heroImage?: File, logo?: File): Promise<SiteContent> {
    const clean: SiteContent = {
      ...input,
      about: {
        ...input.about,
        values: input.about.values.map((value) => value.trim()).filter(Boolean),
        facilities: input.about.facilities.map((value) => value.trim()).filter(Boolean),
      },
      timeSlots: input.timeSlots.map((value) => value.trim()).filter(Boolean),
      openingHours: input.openingHours
        .map(({ day, hours }) => ({ day: day.trim(), hours: hours.trim() }))
        .filter(({ day, hours }) => day && hours),
    };
    return normalizeContent(
      (await api.put<Partial<SiteContent>>("/website", toFormData({ ...clean, heroImage, logo })))
        .data,
    );
  },
};
