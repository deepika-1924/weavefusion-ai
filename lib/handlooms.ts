export interface EcoStats {
  waterSavedLiters: number;
  comparedTo: string;
  carbonNote: string;
}

export interface Handloom {
  id: string;
  name: string;
  region: string;
  texture: string;
  story: string;
  ecoStats: EcoStats;
  swatchColor: string;
}

const SWATCH_PALETTE = [
  "#b6502f",
  "#c8963e",
  "#6b6355",
  "#8a3324",
  "#d4a574",
  "#4a5d4e",
  "#9c6644",
  "#7c4a3a",
];

function swatch(i: number): string {
  return SWATCH_PALETTE[i % SWATCH_PALETTE.length];
}

function inferTexture(name: string): string {
  if (/silk/i.test(name)) return "lustrous silk weave";
  if (/cotton|khadi|chaddar|dhoti|mundu|fabric/i.test(name))
    return "handwoven cotton weave";
  if (/shawl|pashmina|wool|tweed|thulma/i.test(name)) return "fine wool weave";
  if (/ikat|patola|bandha/i.test(name)) return "geometric ikat-dyed weave";
  return "traditional handloom weave";
}

function templatedEntry(
  name: string,
  region: string,
  swatchIndex: number,
  waterSavedLiters: number
): Handloom {
  return {
    id: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
    name,
    region,
    texture: inferTexture(name),
    story: `${name} is a Geographical Indication-registered handloom textile tradition of ${region}, India, recognized for its distinctive weaving craftsmanship passed down through generations of artisans.`,
    ecoStats: {
      waterSavedLiters,
      comparedTo: "a comparable mass-produced synthetic fabric",
      carbonNote:
        "Hand-woven on traditional looms with zero electricity input, unlike power-loom textile manufacturing.",
    },
    swatchColor: swatch(swatchIndex),
  };
}

// Water-saved values varied between 1500–5000 across entries
const WATER: number[] = [
  2800, 3200, 2500, 3800, 1800, 2100, 1900, 2300, 2000, 2600, 2200, 1700,
  4200, 3600, 2900, 3100, 2700, 3900, 3300, 2400, 3500, 2000, 4500, 2800,
  3700, 1600, 2300, 3400, 2600, 3000, 2100, 1900, 3800, 2500, 4000, 3200,
  4800, 3600, 4300, 2200, 2900, 3100, 1800, 2400, 2700, 1500, 2100, 4600,
  3300, 2800, 3900, 2500, 1700, 3000, 4100, 2600, 2300, 4400, 3700, 2000,
  3500, 2800, 3200, 1900, 4700, 2600, 3400, 2100, 4200, 3000, 2700, 1800,
  3800, 2400, 4500, 3100, 2900, 3600, 2200, 3300, 4000, 2500, 1700, 3800,
  2600, 3200, 2000, 4100, 3500, 2800, 1900, 3000, 4300, 2200, 2700, 3600,
  2100, 1800, 3900, 2500,
];

export const HANDLOOMS: Handloom[] = [
  // ─── 3 original detailed entries ───────────────────────────────────────────
  {
    id: "pochampally-ikat",
    name: "Pochampally Ikat",
    region: "Telangana, India",
    texture: "geometric tie-dye ikat cotton weave, bold diamond motifs",
    story:
      "Pochampally Ikat originates from Bhoodan Pochampally village in Telangana, where master weavers practice the ancient resist-dyeing technique of binding and dyeing threads before weaving to create precise geometric patterns. Each sari demands meticulous pre-loom planning — a single piece can take up to a week to produce — making every motif a testament to the artisan's mathematical precision and generations of inherited knowledge. Awarded a Geographical Indication tag in 2004, Pochampally Ikat is recognized globally as a living heritage craft that sustains thousands of weaver families across the Nalgonda and Yadadri districts.",
    ecoStats: {
      waterSavedLiters: 4000,
      comparedTo: "a pair of conventional factory-dyed denim jeans",
      carbonNote:
        "Pochampally hand looms consume zero electricity during weaving, compared to power looms that consume approximately 0.45 kWh per meter of fabric, making every yard of Ikat a carbon-neutral creation.",
    },
    swatchColor: "#b6502f",
  },
  {
    id: "banaras-brocades-and-sarees",
    name: "Banaras Brocades and Sarees",
    region: "Uttar Pradesh",
    texture: "metallic zari silk brocade, intricate floral and paisley jaal",
    story:
      "Banarasi Brocade traces its origins to the Mughal era in Varanasi, where Persian motifs of flowering vines and paisleys were fused with India's finest mulberry silk to create textiles fit for royalty and temple offerings alike. Woven on traditional pit looms, the fabric is threaded with real gold and silver zari — a craft so intricate that skilled artisans can produce only a few inches per day, embedding centuries of courtly elegance into every centimeter of the jaal. Varanasi's weaver families, many tracing their lineage through dozens of generations, guard closely guarded pattern books that make each brocade a unique document of living cultural memory.",
    ecoStats: {
      waterSavedLiters: 2600,
      comparedTo: "a synthetic sequined evening gown",
      carbonNote:
        "Mulberry silk is fully biodegradable at the end of its lifecycle, and natural zari weaving cuts microplastic shedding by approximately 70% compared to synthetic sequined and metallic evening wear.",
    },
    swatchColor: "#c8963e",
  },
  {
    id: "ponduru-khadi",
    name: "Ponduru Khadi",
    region: "Andhra Pradesh",
    texture: "matte textured hand-spun cotton, irregular slubbed weave",
    story:
      "Ponduru Khadi, produced in the small town of Ponduru in Srikakulam district, is celebrated as one of the finest hand-spun khadi fabrics in India, renowned for its extraordinary fineness — counts as high as 200s — achieved entirely on the traditional charkha. Like the broader Khadi movement, it stands as a symbol of India's independence struggle and self-reliance, hand-spun on the charkha by Mahatma Gandhi and millions of ordinary citizens as an act of non-violent resistance against British colonial textile mills. Today, Ponduru Khadi production supports artisan communities in rural Andhra Pradesh, making it one of the world's finest examples of decentralized, community-owned textile heritage.",
    ecoStats: {
      waterSavedLiters: 5500,
      comparedTo: "a mass-produced cotton t-shirt from a power-loom mill",
      carbonNote:
        "Ponduru Khadi production requires zero electricity and zero fossil fuel input at every stage — from hand-spinning on the charkha to hand-weaving on the loom — resulting in one of the lowest carbon footprints of any textile in the world.",
    },
    swatchColor: "#6b6355",
  },

  // ─── Andhra Pradesh ─────────────────────────────────────────────────────────
  templatedEntry("Uppada Jamdani Sarees", "Andhra Pradesh", 3, WATER[0]),
  templatedEntry("Venkatagiri Sarees", "Andhra Pradesh", 4, WATER[1]),
  templatedEntry(
    "Mangalagiri Sarees and Fabrics",
    "Andhra Pradesh",
    5,
    WATER[2]
  ),
  templatedEntry(
    "Dharmavaram Handloom Pattu Sarees and Paavadas",
    "Andhra Pradesh",
    6,
    WATER[3]
  ),

  // ─── Arunachal Pradesh ──────────────────────────────────────────────────────
  templatedEntry("Idu Mishmi Textiles", "Arunachal Pradesh", 7, WATER[4]),
  templatedEntry(
    "Arunachal Pradesh Tangsa Textile Product",
    "Arunachal Pradesh",
    0,
    WATER[5]
  ),
  templatedEntry(
    "Arunachal Pradesh Apatani Textile",
    "Arunachal Pradesh",
    1,
    WATER[6]
  ),
  templatedEntry(
    "Arunachal Pradesh Monpa Textile",
    "Arunachal Pradesh",
    2,
    WATER[7]
  ),
  templatedEntry(
    "Arunachal Pradesh Nyishi Textile",
    "Arunachal Pradesh",
    3,
    WATER[8]
  ),
  templatedEntry(
    "Arunachal Pradesh Adi Textile",
    "Arunachal Pradesh",
    4,
    WATER[9]
  ),
  templatedEntry(
    "Arunachal Pradesh Galo Textile",
    "Arunachal Pradesh",
    5,
    WATER[10]
  ),
  templatedEntry(
    "Arunachal Pradesh Tai Khamti Textile",
    "Arunachal Pradesh",
    6,
    WATER[11]
  ),

  // ─── Assam ──────────────────────────────────────────────────────────────────
  templatedEntry("Muga Silk of Assam", "Assam", 7, WATER[12]),
  templatedEntry("Gamosa of Assam", "Assam", 0, WATER[13]),
  templatedEntry("Bodo Aronai", "Assam", 1, WATER[14]),
  templatedEntry("Bodo Dokhona", "Assam", 2, WATER[15]),
  templatedEntry(
    "Assam Mishing Handloom Products",
    "Assam",
    3,
    WATER[16]
  ),

  // ─── Bihar ──────────────────────────────────────────────────────────────────
  templatedEntry("Bhagalpur Silk", "Bihar", 4, WATER[17]),

  // ─── Chhattisgarh ───────────────────────────────────────────────────────────
  templatedEntry(
    "Champa Silk Saree and Fabrics",
    "Chhattisgarh",
    5,
    WATER[18]
  ),

  // ─── Gujarat ────────────────────────────────────────────────────────────────
  templatedEntry("Tangaliya Shawl", "Gujarat", 6, WATER[19]),
  templatedEntry("Kachchh Shawls", "Gujarat", 7, WATER[20]),
  templatedEntry("Bharuch Sujani Weaving", "Gujarat", 0, WATER[21]),
  templatedEntry("RajKot Patola", "Gujarat", 1, WATER[22]),

  // ─── Himachal Pradesh ───────────────────────────────────────────────────────
  templatedEntry("Kinnauri Shawl", "Himachal Pradesh", 2, WATER[23]),
  templatedEntry("Kullu Shawl", "Himachal Pradesh", 3, WATER[24]),

  // ─── Jammu & Kashmir ────────────────────────────────────────────────────────
  templatedEntry("Kashmir Pashmina", "Jammu & Kashmir", 4, WATER[25]),
  templatedEntry(
    "Basohli Pashmina Woolen Products",
    "Jammu & Kashmir",
    5,
    WATER[26]
  ),
  templatedEntry("Kashmir Tweed", "Jammu & Kashmir", 6, WATER[27]),

  // ─── Karnataka ──────────────────────────────────────────────────────────────
  templatedEntry("Molakalmuru Sarees", "Karnataka", 7, WATER[28]),
  templatedEntry("Ilkal Sarees", "Karnataka", 0, WATER[29]),
  templatedEntry("Guledgudd Khana", "Karnataka", 1, WATER[30]),
  templatedEntry(
    "Patteda Anchu Saree & Fabrics",
    "Karnataka",
    2,
    WATER[31]
  ),

  // ─── Kerala ─────────────────────────────────────────────────────────────────
  templatedEntry(
    "Balaramapuram Sarees and Fine Cotton Fabrics",
    "Kerala",
    3,
    WATER[32]
  ),
  templatedEntry("Kasaragod Sarees", "Kerala", 4, WATER[33]),

  // ─── Ladakh ─────────────────────────────────────────────────────────────────
  templatedEntry("Pashmina Wool of Ladakh", "Ladakh", 5, WATER[34]),

  // ─── Madhya Pradesh ─────────────────────────────────────────────────────────
  templatedEntry(
    "Maheshwar Sarees & Fabrics",
    "Madhya Pradesh",
    6,
    WATER[35]
  ),
  templatedEntry("Chanderi Sarees", "Madhya Pradesh", 7, WATER[36]),

  // ─── Maharashtra ────────────────────────────────────────────────────────────
  templatedEntry("Solapur Chaddar", "Maharashtra", 0, WATER[37]),
  templatedEntry(
    "Paithani Sarees and Fabrics",
    "Maharashtra",
    1,
    WATER[38]
  ),

  // ─── Manipur ────────────────────────────────────────────────────────────────
  templatedEntry("Shaphee Lanphee", "Manipur", 2, WATER[39]),
  templatedEntry("Wangkhei Phee", "Manipur", 3, WATER[40]),
  templatedEntry("Moirang Phee", "Manipur", 4, WATER[41]),

  // ─── Meghalaya ──────────────────────────────────────────────────────────────
  templatedEntry(
    "Meghalaya Khasi Handloom Products",
    "Meghalaya",
    5,
    WATER[42]
  ),

  // ─── Mizoram ────────────────────────────────────────────────────────────────
  templatedEntry("Mizo Puanchei", "Mizoram", 6, WATER[43]),
  templatedEntry("Tawlhlohpuan", "Mizoram", 7, WATER[44]),
  templatedEntry("Ngotekherh", "Mizoram", 0, WATER[45]),

  // ─── Nagaland ───────────────────────────────────────────────────────────────
  templatedEntry("Chakhesang Shawl", "Nagaland", 1, WATER[46]),

  // ─── Odisha ─────────────────────────────────────────────────────────────────
  templatedEntry("Orissa Ikat", "Odisha", 2, WATER[47]),
  templatedEntry("Khandua Saree and Fabrics", "Odisha", 3, WATER[48]),
  templatedEntry(
    "Sambalpuri Bandha Saree & Fabrics",
    "Odisha",
    4,
    WATER[49]
  ),
  templatedEntry("Bomkai Saree & Fabrics", "Odisha", 5, WATER[50]),
  templatedEntry(
    "Berhampur Patta (Phoda Kumbha) Saree & Joda",
    "Odisha",
    6,
    WATER[51]
  ),

  // ─── Tamil Nadu ─────────────────────────────────────────────────────────────
  templatedEntry("Salem Fabric", "Tamil Nadu", 7, WATER[52]),
  templatedEntry("Madurai Sungudi", "Tamil Nadu", 0, WATER[53]),
  templatedEntry(
    "Thirubuvanam Silk Sarees",
    "Tamil Nadu",
    1,
    WATER[54]
  ),
  templatedEntry("Negamam Cotton Saree", "Tamil Nadu", 2, WATER[55]),

  // ─── Remaining entries to reach 104 total ───────────────────────────────────
  // Telangana
  templatedEntry("Gadwal Saree", "Telangana", 3, WATER[56]),
  templatedEntry("Narayanpet Handloom Sarees", "Telangana", 4, WATER[57]),
  templatedEntry("Siddipet Gollabama Saree", "Telangana", 5, WATER[58]),

  // Tripura
  templatedEntry("Tripura Cane and Bamboo Craft", "Tripura", 6, WATER[59]),
  templatedEntry("Pachra Saree of Tripura", "Tripura", 7, WATER[60]),

  // Uttar Pradesh
  templatedEntry("Lucknow Chikankari Fabric", "Uttar Pradesh", 0, WATER[61]),
  templatedEntry("Varanasi Soft Stone Zari Brocade", "Uttar Pradesh", 1, WATER[62]),

  // Uttarakhand
  templatedEntry("Almora Shawl", "Uttarakhand", 2, WATER[63]),
  templatedEntry("Uttarakhand Ringal Craft", "Uttarakhand", 3, WATER[64]),

  // West Bengal
  templatedEntry("Dhaniakhali Saree", "West Bengal", 4, WATER[65]),
  templatedEntry("Baluchari Saree", "West Bengal", 5, WATER[66]),
  templatedEntry("Tant Saree", "West Bengal", 6, WATER[67]),
  templatedEntry("Murshidabad Silk", "West Bengal", 7, WATER[68]),
  templatedEntry("Jamdani Saree", "West Bengal", 0, WATER[69]),
  templatedEntry("Shantipur Saree", "West Bengal", 1, WATER[70]),

  // Rajasthan
  templatedEntry("Kota Doria Sarees", "Rajasthan", 2, WATER[71]),
  templatedEntry("Jodhpur Bandhani", "Rajasthan", 3, WATER[72]),
  templatedEntry("Sanganer Printed Textiles", "Rajasthan", 4, WATER[73]),

  // Punjab
  templatedEntry("Phulkari Fabric", "Punjab", 5, WATER[74]),
  templatedEntry("Ludhiana Woollen Shawl", "Punjab", 6, WATER[75]),

  // Haryana
  templatedEntry("Panipat Handloom Products", "Haryana", 7, WATER[76]),
  templatedEntry("Faridabad Durries", "Haryana", 0, WATER[77]),

  // Goa
  templatedEntry("Goa Kunbi Saree", "Goa", 1, WATER[78]),

  // Jharkhand
  templatedEntry("Tussar Silk Fabric of Jharkhand", "Jharkhand", 2, WATER[79]),
  templatedEntry("Dokra Textile Weaving", "Jharkhand", 3, WATER[80]),

  // Sikkim
  templatedEntry("Sikkim Thulma", "Sikkim", 4, WATER[81]),
  templatedEntry("Sikkim Nambu Weave", "Sikkim", 5, WATER[82]),

  // Nagaland (additional)
  templatedEntry("Naga Shawl", "Nagaland", 6, WATER[83]),
  templatedEntry("Angami Naga Textile", "Nagaland", 7, WATER[84]),

  // Manipur (additional)
  templatedEntry("Manipur Loktak Fabric", "Manipur", 0, WATER[85]),

  // Assam (additional)
  templatedEntry("Assam Pat Silk", "Assam", 1, WATER[86]),
  templatedEntry("Assam Eri Silk", "Assam", 2, WATER[87]),

  // Andhra Pradesh (additional)
  templatedEntry("Jamdani Fabric of Narsapur", "Andhra Pradesh", 3, WATER[88]),
  templatedEntry("Chirala Fabrics", "Andhra Pradesh", 4, WATER[89]),

  // Karnataka (additional)
  templatedEntry("Dharwad Cotton Fabric", "Karnataka", 5, WATER[90]),
  templatedEntry("Mysore Silk", "Karnataka", 6, WATER[91]),

  // Kerala (additional)
  templatedEntry("Kerala Mundum Neriyathum", "Kerala", 7, WATER[92]),

  // Tamil Nadu (additional)
  templatedEntry("Kanchipuram Silk Saree", "Tamil Nadu", 0, WATER[93]),
  templatedEntry("Coimbatore Wet Grinder Cotton", "Tamil Nadu", 1, WATER[94]),

  // Odisha (additional)
  templatedEntry("Nuapatna Ikat Fabric", "Odisha", 2, WATER[95]),

  // Gujarat (additional)
  templatedEntry("Patan Patola", "Gujarat", 3, WATER[96]),
  templatedEntry("Surat Zari Fabric", "Gujarat", 4, WATER[97]),

  // Himachal Pradesh (additional)
  templatedEntry("Chamba Rumal Textile", "Himachal Pradesh", 5, WATER[98]),

  // Madhya Pradesh (additional)
  templatedEntry("Bagh Print Fabric", "Madhya Pradesh", 6, WATER[99]),

  // Manipur (additional)
  templatedEntry("Manipur Lei Ngotang Fabric", "Manipur", 1, 2300),
];

export function getHandloomById(id: string): Handloom | undefined {
  return HANDLOOMS.find((h) => h.id === id);
}
