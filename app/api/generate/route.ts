import { NextRequest, NextResponse } from "next/server";
import { getHandloomById } from "@/lib/handlooms";
import { getStyleById } from "@/lib/styles";
import { getHeritageNarrative } from "@/lib/watsonx";
import { generateGarmentImage } from "@/lib/imageGen";
import { applyVirtualTryOn } from "@/lib/virtualTryOn";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    handloomId,
    styleId,
    userPhoto,
  } = body as {
    handloomId?: string;
    styleId?: string;
    userPhoto?: string;
  };

  const handloom = handloomId ? getHandloomById(handloomId) : undefined;
  const style = styleId ? getStyleById(styleId) : undefined;

  if (!handloom || !style) {
    return NextResponse.json(
      { error: "Invalid handloomId or styleId" },
      { status: 400 }
    );
  }

  // Run story generation and garment image in parallel
  const [{ story, ecoNote, source }, garmentImageUrl] = await Promise.all([
    getHeritageNarrative(handloom, style.name),
    generateGarmentImage(handloom, style),
  ]);

  // Apply virtual try-on if user provided a photo
  let imageUrl = garmentImageUrl;
  let tryOnApplied = false;

  if (userPhoto) {
    const tryOnResult = await applyVirtualTryOn(userPhoto, garmentImageUrl);
    // Only mark as applied if the URL actually changed (not the fallback)
    tryOnApplied = tryOnResult !== garmentImageUrl;
    imageUrl = tryOnResult;
  }

  return NextResponse.json({
    handloom,
    style,
    story,
    ecoNote,
    source,
    imageUrl,
    tryOnApplied,
  });
}
