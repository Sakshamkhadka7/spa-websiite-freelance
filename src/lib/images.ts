import hero from "@/assets/hero.jpg";
import aroma from "@/assets/aroma.jpg";
import hotstone from "@/assets/hotstone.jpg";
import room from "@/assets/room.jpg";
import team1 from "@/assets/team1.jpg";
import team2 from "@/assets/team2.jpg";
import therapistMassage from "@/assets/pexels-therapist-massage.jpg";
import pexelsHotstone from "@/assets/pexels-hot-stone.jpg";
import facial from "@/assets/pexels-facial.jpg";
import ritual from "@/assets/pexels-ritual.jpg";
import spaInterior from "@/assets/pexels-spa-interior.jpg";
import couplesMassage from "@/assets/pexels-couples-massage.jpg";
import facialNeutral from "@/assets/pexels-facial-neutral.jpg";
import { backendImageUrl } from "./api";

const assets: Record<string, string> = {
  hero,
  aroma,
  hotstone,
  room,
  team1,
  team2,
  therapistMassage,
  pexelsHotstone,
  facial,
  ritual,
  spaInterior,
  couplesMassage,
  facialNeutral,
};

/** Seed data references bundled images as "asset:<key>" so URLs survive rebuilds. */
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
