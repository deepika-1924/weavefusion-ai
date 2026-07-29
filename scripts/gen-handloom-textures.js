#!/usr/bin/env node
/**
 * scripts/gen-handloom-textures.js
 *
 * Generates texture images for handloom fabric swatches using
 * Replicate's flux-schnell model and saves them to public/textures/.
 *
 * Usage:
 *   node scripts/gen-handloom-textures.js
 *
 * Prerequisites:
 *   REPLICATE_API_TOKEN set in .env.local (read automatically by this script).
 *
 * Output:
 *   public/textures/<slug>.webp  — one file per entry in TEXTURES below.
 *
 * Already-generated files are skipped (idempotent — safe to re-run).
 *
 * Rate limiting:
 *   Requests are serialised (one at a time) to avoid hammering the API.
 *   The `Prefer: wait` header asks Replicate to block until the prediction
 *   finishes (up to ~60 s). If the response comes back as still "processing"
 *   (Replicate fell back to async), the script polls the prediction URL until
 *   it either succeeds or fails.
 */

"use strict";

const path  = require("path");
const fs    = require("fs");
const https = require("https");
const url   = require("url");

// ── 1. Load REPLICATE_API_TOKEN from .env.local ───────────────────────────────
const envLocalPath = path.join(__dirname, "..", ".env.local");

if (!fs.existsSync(envLocalPath)) {
  console.error("ERROR: .env.local not found at", envLocalPath);
  process.exit(1);
}

const envLocal = fs.readFileSync(envLocalPath, "utf8");
const tokenMatch = envLocal.match(/^REPLICATE_API_TOKEN=(.+)$/m);

if (!tokenMatch || !tokenMatch[1].trim()) {
  console.error(
    "ERROR: REPLICATE_API_TOKEN is not set or empty in .env.local\n" +
    "Get a token at https://replicate.com/account/api-tokens"
  );
  process.exit(1);
}

const REPLICATE_TOKEN = tokenMatch[1].trim();

// ── 2. Output directory ───────────────────────────────────────────────────────
const OUT_DIR = path.join(__dirname, "..", "public", "textures");
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── 3. Texture definitions ────────────────────────────────────────────────────
// Each entry produces:  public/textures/<slug>.webp
//
// Prompt craft notes:
//   - "close-up macro photo" forces the model into a fabric/texture mindset
//   - "flat lay top-down" eliminates perspective distortion
//   - "seamless repeating pattern" helps it tile correctly if used as a material
//   - Negative guidance baked into prompt: "no model, no person, no hands"
//   - Image size 768×768 (square) — good for texture use
//
const TEXTURES = [
  // ── Silk traditions ────────────────────────────────────────────────────────
  {
    slug: "kanchipuram-silk",
    prompt:
      "Close-up macro photograph of authentic Kanchipuram silk handloom textile, " +
      "temple border pattern with intricate gold zari, rich emerald green silk base, " +
      "fine warp and weft threads clearly visible, lustrous sheen, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "banarasi-brocade",
    prompt:
      "Close-up macro photograph of authentic Banarasi brocade handloom silk textile, " +
      "ornate gold zari floral jaal motifs, deep maroon silk base, " +
      "metallic thread weave detail, fine warp and weft clearly visible, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "chanderi",
    prompt:
      "Close-up macro photograph of authentic Chanderi handloom textile, " +
      "sheer lightweight cotton-silk weave, delicate scattered gold coin buttis, " +
      "ivory and pale gold threads, translucent gossamer quality, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  // ── Ikat traditions ────────────────────────────────────────────────────────
  {
    slug: "pochampally-ikat",
    prompt:
      "Close-up macro photograph of authentic Pochampally Ikat handloom textile, " +
      "bold geometric diamond and chevron resist-dye pattern, " +
      "deep rust orange and indigo threads, characteristic ikat feathered-edge effect, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "orissa-ikat",
    prompt:
      "Close-up macro photograph of authentic Orissa Ikat handloom textile, " +
      "intricate double-ikat woven pattern, traditional fish and temple motifs, " +
      "deep teal and crimson threads, characteristic soft ikat edges, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  // ── Cotton traditions ──────────────────────────────────────────────────────
  {
    slug: "ponduru-khadi",
    prompt:
      "Close-up macro photograph of authentic Ponduru Khadi hand-spun cotton textile, " +
      "extremely fine natural white hand-spun thread, irregular slub texture visible, " +
      "matte natural cotton surface, artisanal weave irregularities, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "tant-saree",
    prompt:
      "Close-up macro photograph of authentic Bengal Tant handloom cotton saree fabric, " +
      "fine crisp white cotton weave with delicate woven border motifs, " +
      "lightweight and airy textile, thread count visible, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  // ── Wool / shawl traditions ────────────────────────────────────────────────
  {
    slug: "kashmir-pashmina",
    prompt:
      "Close-up macro photograph of authentic Kashmir Pashmina handloom shawl textile, " +
      "ultra-fine soft wool fibres, traditional paisley and chinar leaf embroidery, " +
      "natural ivory and saffron tones, luxuriously soft surface, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "kullu-shawl",
    prompt:
      "Close-up macro photograph of authentic Kullu Shawl handloom textile, " +
      "bold geometric border pattern in crimson, black and gold wool, " +
      "dense warm twill weave, mountain folk art motifs, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  // ── Regional specialities ──────────────────────────────────────────────────
  {
    slug: "jamdani-saree",
    prompt:
      "Close-up macro photograph of authentic Jamdani handloom muslin textile, " +
      "intricate supplementary weft floral and botanical motifs woven directly into sheer fabric, " +
      "fine translucent white muslin base, gold and white pattern threads, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "baluchari-saree",
    prompt:
      "Close-up macro photograph of authentic Baluchari handloom silk saree textile, " +
      "narrative mythological scene woven in the pallu, deep wine-red silk base, " +
      "untwisted silk thread creating a mat finish, intricate border repeat, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
  {
    slug: "paithani-sarees",
    prompt:
      "Close-up macro photograph of authentic Paithani handloom silk saree textile, " +
      "oblique interlocking tapestry weave, peacock and lotus motifs in vibrant multicolor, " +
      "gold zari border, rich jewel-toned silk, " +
      "flat lay top-down studio lighting, seamless repeating fabric texture, " +
      "no model no person no hands, ultra high detail, 8k",
  },
];

// ── 4. HTTP helpers ───────────────────────────────────────────────────────────

/**
 * Minimal promise-based HTTPS POST / GET.
 * Returns { statusCode, body (parsed JSON) }.
 */
function httpsRequest(options, postBody) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          resolve({ statusCode: res.statusCode, body });
        } catch (e) {
          reject(new Error("JSON parse failed: " + e.message));
        }
      });
    });
    req.on("error", reject);
    if (postBody) req.write(postBody);
    req.end();
  });
}

/**
 * Poll a Replicate prediction URL until it reaches "succeeded" or "failed".
 * Returns the final prediction body.
 */
async function pollPrediction(predictionUrl, intervalMs = 2000, maxWaitMs = 120_000) {
  const parsed = new url.URL(predictionUrl);
  const started = Date.now();

  while (true) {
    if (Date.now() - started > maxWaitMs) {
      throw new Error("Timed out polling prediction: " + predictionUrl);
    }

    await new Promise((r) => setTimeout(r, intervalMs));

    const { statusCode, body } = await httpsRequest({
      hostname: parsed.hostname,
      path: parsed.pathname + (parsed.search || ""),
      method: "GET",
      headers: {
        Authorization: "Bearer " + REPLICATE_TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (statusCode !== 200) {
      throw new Error("Poll HTTP " + statusCode + ": " + JSON.stringify(body));
    }

    if (body.status === "succeeded") return body;
    if (body.status === "failed" || body.status === "canceled") {
      throw new Error("Prediction " + body.status + ": " + (body.error ?? "unknown"));
    }

    process.stdout.write(".");
  }
}

/**
 * Download a URL to a local file path using https.get.
 * Follows exactly one redirect (Replicate CDN sometimes redirects).
 */
function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const attempt = (attemptUrl) => {
      https.get(attemptUrl, (res) => {
        // Follow a single redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          attempt(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error("Download HTTP " + res.statusCode + " for " + attemptUrl));
          return;
        }
        const out = fs.createWriteStream(destPath);
        res.pipe(out);
        out.on("finish", () => out.close(resolve));
        out.on("error", reject);
      }).on("error", reject);
    };
    attempt(fileUrl);
  });
}

// ── 5. Generate one texture ───────────────────────────────────────────────────

async function generateTexture({ slug, prompt }) {
  const destPath = path.join(OUT_DIR, slug + ".webp");

  // Skip if already generated (idempotent)
  if (fs.existsSync(destPath)) {
    console.log(`  ✓ skip   ${slug}.webp  (already exists)`);
    return;
  }

  process.stdout.write(`  ⟳ gen    ${slug} … `);

  // ── 5a. Submit prediction ────────────────────────────────────────────────
  const payload = JSON.stringify({
    input: {
      prompt,
      width:  768,
      height: 768,
      // flux-schnell default steps is 4; go up to 6 for slightly better detail
      num_inference_steps: 6,
    },
  });

  const { statusCode, body: prediction } = await httpsRequest(
    {
      hostname: "api.replicate.com",
      path: "/v1/models/black-forest-labs/flux-schnell/predictions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + REPLICATE_TOKEN,
        // Ask Replicate to respond synchronously (blocks until done, ≤60 s)
        Prefer: "wait",
      },
    },
    payload
  );

  if (statusCode !== 200 && statusCode !== 201) {
    throw new Error(
      "Replicate API HTTP " + statusCode + ": " + JSON.stringify(prediction)
    );
  }

  // ── 5b. Resolve output URL (sync or async) ───────────────────────────────
  let imageUrl;

  if (prediction.output && prediction.output.length > 0) {
    // Synchronous response — `Prefer: wait` worked
    imageUrl = prediction.output[0];
  } else if (
    prediction.status === "starting" ||
    prediction.status === "processing"
  ) {
    // Replicate fell back to async — poll until done
    process.stdout.write("(polling) ");
    const final = await pollPrediction(prediction.urls.get);
    if (!final.output || final.output.length === 0) {
      throw new Error("Prediction succeeded but output was empty");
    }
    imageUrl = final.output[0];
  } else {
    throw new Error(
      "Unexpected prediction state: " + JSON.stringify(prediction)
    );
  }

  // ── 5c. Download image to disk ───────────────────────────────────────────
  await downloadFile(imageUrl, destPath);

  // Verify the file was actually written and has content
  const stat = fs.statSync(destPath);
  if (stat.size < 1024) {
    fs.unlinkSync(destPath); // remove corrupt/tiny file so next run retries
    throw new Error("Downloaded file too small (" + stat.size + " bytes) — likely an error image");
  }

  console.log("done  (" + Math.round(stat.size / 1024) + " KB)");
}

// ── 6. Main — serialised loop ─────────────────────────────────────────────────

async function main() {
  console.log("\nWeaveFusion AI — handloom texture generator");
  console.log("Output directory:", OUT_DIR);
  console.log("Textures to process:", TEXTURES.length, "\n");

  const errors = [];

  for (const entry of TEXTURES) {
    try {
      await generateTexture(entry);
    } catch (err) {
      // Don't abort the whole run on a single failure — log and continue
      console.error(`\n  ✗ ERROR  ${entry.slug}: ${err.message}`);
      errors.push({ slug: entry.slug, error: err.message });
    }
    await new Promise(r => setTimeout(r, 12000));
  }

  console.log("\n─────────────────────────────────────────");
  if (errors.length === 0) {
    console.log(`✓ All ${TEXTURES.length} textures generated successfully.`);
  } else {
    console.log(`Completed with ${errors.length} error(s):`);
    errors.forEach(({ slug, error }) => console.log(`  ✗ ${slug}: ${error}`));
    console.log("\nRe-run the script to retry failed entries (skips existing files).");
    process.exitCode = 1;
  }

  // Print a summary of what's now on disk
  console.log("\nFiles in public/textures/:");
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".webp"));
  if (files.length === 0) {
    console.log("  (none)");
  } else {
    files.forEach((f) => {
      const kb = Math.round(fs.statSync(path.join(OUT_DIR, f)).size / 1024);
      console.log(`  ${f}  (${kb} KB)`);
    });
  }
  console.log("");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
