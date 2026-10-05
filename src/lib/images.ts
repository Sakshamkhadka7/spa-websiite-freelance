import hero from "@/assets/hero.jpg";
import aroma from "@/assets/aroma.jpg";
import hotstone from "@/assets/hotstone.jpg";
import room from "@/assets/room.jpg";
import team1 from "@/assets/team1.jpg";
import team2 from "@/assets/team2.jpg";

const assets: Record<string, string> = { hero, aroma, hotstone, room, team1, team2 };

/** Seed data references bundled images as "asset:<key>" so URLs survive rebuilds. */
export function img(src: string): string {
  if (src.startsWith("asset:")) return assets[src.slice(6)] ?? "";
  return src;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
