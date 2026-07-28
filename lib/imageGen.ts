import type { Handloom } from "@/lib/handlooms";
import type { WesternStyle } from "@/lib/styles";

function buildGarmentPrompt(handloom: Handloom, style: WesternStyle): string {
  return (
    `flat lay product photography of a ${style.promptFragment} made from ${handloom.texture}, ` +
    `plain white background, no model, studio lighting, high detail`
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
