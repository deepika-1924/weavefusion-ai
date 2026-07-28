const IDM_VTON_VERSION =
  "906547a5da0bc1f88ecac3073fc1f48f6a5e98a8040a4c5bbd95c7f0ebff0e4b";

export async function applyVirtualTryOn(
  userPhotoDataUrl: string,
  garmentImageUrl: string
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    return garmentImageUrl;
  }

  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
        Prefer: "wait=30",
      },
      body: JSON.stringify({
        version: IDM_VTON_VERSION,
        input: {
          human_img: userPhotoDataUrl,
          garm_img: garmentImageUrl,
          garment_des: "a handloom fashion garment",
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`IDM-VTON prediction failed: ${res.status}`);
    }

    let prediction = await res.json();

    // Poll if not immediately complete
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await new Promise((r) => setTimeout(r, 1500));
      const pollUrl: string = prediction.urls?.get;
      if (!pollUrl) break;

      const pollRes = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      if (!pollRes.ok) break;
      prediction = await pollRes.json();
    }

    if (prediction.status !== "succeeded") {
      throw new Error(`IDM-VTON ended with status: ${prediction.status}`);
    }

    const output = prediction.output;
    const outputUrl =
      typeof output === "string"
        ? output
        : Array.isArray(output)
        ? output[0]
        : null;

    if (!outputUrl) throw new Error("No output URL from IDM-VTON");
    return outputUrl as string;
  } catch {
    // Graceful degradation — return the garment image unchanged
    return garmentImageUrl;
  }
}
