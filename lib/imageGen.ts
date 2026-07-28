import type { Handloom } from "@/lib/handlooms";
import type { WesternStyle } from "@/lib/styles";

function buildGarmentPrompt(handloom: Handloom, style: WesternStyle): string {
  return (
    `Professional fashion editorial photograph of a ${style.promptFragment} ` +
    `crafted entirely from ${handloom.name} ${handloom.texture}, ` +
    `featuring authentic handwoven fabric texture with visible warp and weft threads, ` +
    `draped on a faceless mannequin against a pure white seamless studio backdrop, ` +
    `shot with a 85mm lens, soft diffused key light from camera-left, subtle fill reflector on right, ` +
    `crisp fabric detail rendering, true-to-life color accuracy, ` +
    `ultra-high resolution commercial garment photography, ` +
    `no background objects, no watermarks, no text overlays, no grain, no blur, ` +
    `8k detail, hyperrealistic textile photography`
  );
}

async function garmentViaReplicate(
  handloom: Handloom,
  style: WesternStyle
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN!;
  const prompt = buildGarmentPrompt(handloom, style);

  const res = await fetch(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
        Prefer: "wait",
      },
      body: JSON.stringify({ input: { prompt } }),
    }
  );

  if (!res.ok) throw new Error(`Replicate flux-schnell error: ${res.status}`);
  const data = await res.json();
  const url = data.output?.[0];
  if (!url) throw new Error("No output URL from flux-schnell");
  return url as string;
}

async function garmentViaPollinations(
  handloom: Handloom,
  style: WesternStyle
): Promise<string> {
  const prompt = buildGarmentPrompt(handloom, style);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=1024&nologo=true`;
}

export async function generateGarmentImage(
  handloom: Handloom,
  style: WesternStyle
): Promise<string> {
  if (process.env.REPLICATE_API_TOKEN) {
    return garmentViaReplicate(handloom, style);
  }
  return garmentViaPollinations(handloom, style);
}
