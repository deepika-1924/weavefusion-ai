# WeaveFusion AI

AI-generated sustainable fashion from India's GI-tagged handloom traditions. Pick a handloom (from all 104 Tier-1 GI-registered fabrics) and a Western silhouette, and the app generates a live outfit render plus a heritage story and sustainability scorecard.

## Stack

Next.js 14 + TypeScript + Tailwind, Framer Motion for the scroll animation, watsonx.ai (Granite) for text generation, Replicate (flux-schnell + IDM-VTON) for image generation.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, and `REPLICATE_API_TOKEN`.
3. `npm run dev`

## How IBM Bob Was Used

Bob was used throughout development inside this repo, not just for scaffolding:

- Generated the initial dashboard layout (sidebar handloom/style selectors, story card, outfit canvas) from a natural-language prompt describing the three-panel layout.
- Debugged the `/api/generate` route so it calls watsonx Granite and the image-generation API in parallel, falls back to mock data when a key is missing, and returns a single merged JSON payload — this included fixing a bug where the two branches weren't actually running concurrently.
- Diagnosed and fixed a scroll-trap bug that blocked users from reaching Step 3/4 of the flow.
- Helped redesign the UI from a static layout into an interactive step flow with a searchable grid across all 104 GI-tagged handlooms.
- Assisted in wiring up and later removing the live photo-upload/virtual try-on feature (Replicate IDM-VTON) as the product direction shifted toward a curated lookbook experience.
- Helped restructure the site to add a scroll-triggered awareness intro using Framer Motion.
