export interface WesternStyle {
  id: string;
  name: string;
  promptFragment: string;
}

export const WESTERN_STYLES: WesternStyle[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    promptFragment:
      "oversized silhouette with relaxed-fit jogger trousers, cropped hoodie, chunky sneakers, and a crossbody bag, urban street style editorial",
  },
  {
    id: "minimalist-tailoring",
    name: "Minimalist Tailoring",
    promptFragment:
      "sharp single-breasted blazer with wide-leg trousers, clean lines, minimal accessories, structured shoulder silhouette, modern workwear editorial",
  },
  {
    id: "athleisure",
    name: "Athleisure",
    promptFragment:
      "fitted performance leggings with a longline sports bra and a draped open-front jacket, sporty-chic silhouette with sleek trainers, activewear editorial",
  },
  {
    id: "evening-gown",
    name: "Evening Gown",
    promptFragment:
      "floor-length draped gown with a deep V neckline, thigh-high slit, elegant long gloves, and strappy heeled sandals, luxury couture editorial",
  },
];

export function getStyleById(id: string): WesternStyle | undefined {
  return WESTERN_STYLES.find((s) => s.id === id);
}
