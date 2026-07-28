import type { Handloom } from "@/lib/handlooms";

interface WatsonxMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface WatsonxResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function getIAMToken(apiKey: string): Promise<string> {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });
  if (!res.ok) {
    throw new Error(`IAM token fetch failed: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export interface HeritageResult {
  story: string;
  ecoNote: string;
  source: "watsonx" | "fallback";
}

export async function getHeritageNarrative(
  handloom: Handloom,
  styleName: string
): Promise<HeritageResult> {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const watsonxUrl =
    process.env.WATSONX_URL ?? "https://us-south.ml.cloud.ibm.com";
  const modelId =
    process.env.WATSONX_MODEL_ID ?? "ibm/granite-3-8b-instruct";

  if (!apiKey || !projectId) {
    return buildFallback(handloom, styleName);
  }

  try {
    const token = await getIAMToken(apiKey);

    const messages: WatsonxMessage[] = [
      {
        role: "system",
        content:
          "You are a fashion and textile heritage expert. Write vivid, accurate, and inspiring prose. Be concise.",
      },
      {
        role: "user",
        content: `Write exactly 3 sentences about the heritage and craft of ${handloom.name} from ${handloom.region} (texture: ${handloom.texture}). Then write exactly 1 sentence connecting this fabric's sustainability story to a ${styleName} outfit. Format your response as:\nHERITAGE: <3 sentences>\nECO NOTE: <1 sentence>`,
      },
    ];

    const endpoint = `${watsonxUrl}/ml/v1/text/chat?version=2023-05-29`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model_id: modelId,
        project_id: projectId,
        messages,
        parameters: {
          max_new_tokens: 400,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Watsonx API error: ${res.status}`);
    }

    const data: WatsonxResponse = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";

    const heritageMatch = raw.match(/HERITAGE:\s*([\s\S]+?)(?=ECO NOTE:|$)/);
    const ecoMatch = raw.match(/ECO NOTE:\s*([\s\S]+)/);

    const story = heritageMatch?.[1]?.trim() ?? handloom.story;
    const ecoNote =
      ecoMatch?.[1]?.trim() ??
      `${handloom.ecoStats.carbonNote} Wearing ${handloom.name} as ${styleName} saves approximately ${handloom.ecoStats.waterSavedLiters.toLocaleString()} liters of water compared to ${handloom.ecoStats.comparedTo}.`;

    return { story, ecoNote, source: "watsonx" };
  } catch {
    return buildFallback(handloom, styleName);
  }
}

function buildFallback(handloom: Handloom, styleName: string): HeritageResult {
  return {
    story: handloom.story,
    ecoNote: `${handloom.ecoStats.carbonNote} Wearing ${handloom.name} as ${styleName} saves approximately ${handloom.ecoStats.waterSavedLiters.toLocaleString()} liters of water compared to ${handloom.ecoStats.comparedTo}.`,
    source: "fallback",
  };
}
