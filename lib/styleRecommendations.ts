import { Handloom } from "./handlooms";

export interface StyleRecommendation {
  bestFor: string[];
  occasions: string[];
  stylingTip: string;
  difficulty: string;
}

interface Rule {
  pattern: RegExp;
  rec: StyleRecommendation;
}

const RULES: Rule[] = [
  {
    pattern: /silk|zari|brocade|kanjivaram|kanchipuram|banarasi|paithani|patola|tussar|muga|eri/i,
    rec: {
      bestFor: ["Structured Blazer", "Evening Gown", "Cropped Jacket", "Statement Skirt"],
      occasions: ["Semi-formal", "Evening", "Wedding guest"],
      stylingTip: "Let the sheen do the talking. Pair with matte black trousers or a simple silk camisole so the weave stays the star.",
      difficulty: "Structured tailoring",
    },
  },
  {
    pattern: /wool|shawl|pashmina|tweed|thulma|phulkari|kullu|kinnauri/i,
    rec: {
      bestFor: ["Wrap Coat", "Structured Overcoat", "Poncho", "Oversized Scarf"],
      occasions: ["Winter layering", "Office", "Travel"],
      stylingTip: "Use it as an outer layer over solid neutrals. The texture reads best when it is not competing with another pattern.",
      difficulty: "Simple draping",
    },
  },
  {
    pattern: /jamdani|chanderi|muslin|sheer|organza|kota/i,
    rec: {
      bestFor: ["Blouse", "Slip Dress", "Camisole", "Kimono Wrap"],
      occasions: ["Semi-formal", "Evening", "Date night"],
      stylingTip: "Layer over a solid slip so the fine weave is visible without being sheer in the wrong places.",
      difficulty: "Delicate fabric handling",
    },
  },
  {
    pattern: /kotpad|tribal|madder|natural.?dye|warli|gond|santhal|naga/i,
    rec: {
      bestFor: ["Utility Jacket", "Wrap Skirt", "Cropped Vest", "Structured Tote"],
      occasions: ["Casual", "Festival", "Boho"],
      stylingTip: "Pair with raw-edge denim or linen. Earthy dyes look best against equally organic textures.",
      difficulty: "Relaxed, forgiving fit",
    },
  },
  {
    pattern: /cotton|khadi|ikat|ajrakh|kalamkari|bagh|dabu|block.?print|ilkal|chaddar|dhoti|mundu/i,
    rec: {
      bestFor: ["Shirt Dress", "Wide-leg Trousers", "Bomber Jacket", "Utility Jumpsuit"],
      occasions: ["Office", "Casual", "Everyday"],
      stylingTip: "Keep the rest of the outfit minimal. Sneakers and a plain tee let the print carry the look.",
      difficulty: "Beginner-friendly cut",
    },
  },
];

const DEFAULT_REC: StyleRecommendation = {
  bestFor: ["Shirt Dress", "Structured Blazer", "Wide-leg Trousers"],
  occasions: ["Office", "Casual", "Semi-formal"],
  stylingTip: "Keep silhouettes clean and let the handwoven texture be the focal point of the outfit.",
  difficulty: "Versatile, easy to style",
};

export function getStyleRecommendation(handloom: Handloom): StyleRecommendation {
  const haystack = `${handloom.name} ${handloom.texture}`;
  for (const rule of RULES) {
    if (rule.pattern.test(haystack)) return rule.rec;
  }
  return DEFAULT_REC;
}
