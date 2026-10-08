import { backendImageUrl } from "./api";

const spaAsset = (name: string) => `/assets/spa/${name}`;

const assets: Record<string, string> = {
  hero: spaAsset("spa-hero.jpg"),
  aroma: spaAsset("aromatherapy-essentials.jpg"),
  hotstone: spaAsset("hot-stone-massage.jpg"),
  room: spaAsset("luxury-massage-room.jpg"),
  team1: spaAsset("therapist-amara.jpg"),
  team2: spaAsset("therapist-maya.jpg"),
  therapistMassage: spaAsset("professional-massage-treatment.jpg"),
  pexelsHotstone: spaAsset("warm-stone-therapy.jpg"),
  facial: spaAsset("facial-treatment.jpg"),
  ritual: spaAsset("wellness-ritual.jpg"),
  spaInterior: spaAsset("spa-interior.jpg"),
  couplesMassage: spaAsset("couples-massage.jpg"),
  facialNeutral: spaAsset("facial-ritual.jpg"),
};

/** Seed data references local images as "asset:<key>" while API media stays dynamic. */
export function img(src: string): string {
  if (src.startsWith("asset:")) return assets[src.slice(6)] ?? "";
  return backendImageUrl(src);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
