#!/usr/bin/env node
/**
 * Bundle weight report (brief §07A performance budgets).
 * Reports gzip weight per client chunk, flags the 3D chunk, and shows which
 * chunks the homepage loads on first paint vs. lazily.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHUNK_DIR = path.join(ROOT, ".next", "static", "chunks");

function gzipSize(file) {
  return gzipSync(readFileSync(file), { level: 9 }).length;
}

function classify(file) {
  const source = readFileSync(file, "utf8");
  const tags = [];
  if (source.includes("WebGLRenderer") || source.includes("LatheGeometry")) tags.push("3D (three/R3F)");
  if (source.includes("useForm")) tags.push("forms (RHF)");
  if (source.includes("zod") || source.includes("ZodError")) tags.push("zod");
  return tags;
}

const files = readdirSync(CHUNK_DIR)
  .filter((name) => name.endsWith(".js"))
  .map((name) => path.join(CHUNK_DIR, name))
  .filter((file) => statSync(file).size > 0);

const rows = files
  .map((file) => ({
    name: path.basename(file),
    raw: statSync(file).size,
    gzip: gzipSize(file),
    tags: classify(file),
  }))
  .sort((a, b) => b.gzip - a.gzip);

console.log("\nClient chunks (gzip, level 9)\n");
for (const row of rows.slice(0, 12)) {
  console.log(
    `  ${(row.gzip / 1024).toFixed(1).padStart(7)} KB  ${(row.raw / 1024).toFixed(1).padStart(7)} KB raw  ${row.name}${
      row.tags.length ? `  [${row.tags.join(", ")}]` : ""
    }`,
  );
}

const total = rows.reduce((sum, row) => sum + row.gzip, 0);
console.log(`\n  ${(total / 1024).toFixed(1)} KB gzip across ${rows.length} client chunks`);

// Which chunks does the homepage request eagerly?
const manifestPath = path.join(ROOT, ".next", "app-build-manifest.json");
try {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const home = manifest.pages?.["/page"] ?? manifest.pages?.["/"] ?? [];
  const homeFiles = home
    .map((chunk) => path.join(ROOT, ".next", chunk.replace(/^static/, "static")))
    .filter((file) => statSync(file, { throwIfNoEntry: false }));
  const homeGzip = homeFiles.reduce((sum, file) => sum + gzipSize(file), 0);
  console.log(
    `\n  Homepage initial JS: ${homeFiles.length} chunks · ${(homeGzip / 1024).toFixed(1)} KB gzip`,
  );
  const threeInHome = homeFiles.some((file) => classify(file).includes("3D (three/R3F)"));
  console.log(
    `  3D chunk in the initial payload: ${threeInHome ? "YES (deferred load failed)" : "no — loaded after first paint"}`,
  );
} catch (error) {
  console.log(`\n  (app-build-manifest.json unavailable: ${error.message})`);
}
console.log("");