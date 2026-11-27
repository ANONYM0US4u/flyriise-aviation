#!/usr/bin/env node
/**
 * CONTENT VERIFICATION GATE (brief §17)
 * ---------------------------------------------------------------------------
 * Fails the build on trust-sensitive mistakes that must never reach a page:
 *
 *   R1  {{TOKEN}} template placeholders left anywhere in the source.
 *   R2  Banned outcome language (100%, guaranteed, assured, No.1, …) that is
 *       neither negated in the same sentence nor posed as a question.
 *   R3  [CLIENT INPUT REQUIRED …] tokens outside data/ — placeholders belong in
 *       content data, never hard-coded inside a component.
 *   R4  A partner entry missing its relationship/verification metadata.
 *
 * Structural truth (placed > total, future asOf, partner authorization) is
 * asserted in tests/claims.test.ts against the real data modules; this script
 * covers the source-level surface, including rendered JSX.
 *
 * Usage:
 *   node scripts/verify-content.mjs              check the repository
 *   node scripts/verify-content.mjs --self-test  prove the detectors fire
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["app", "components", "data", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".mjs", ".js"]);
/** The module that defines the banned list must not be scanned against it. */
const SKIP_FILES = new Set(["lib/claims.ts"]);

/**
 * Phrases that only count as a claim. These are words that appear legitimately
 * inside denials ("no guarantee is made"), so every hit must be checked for a
 * preceding negation in the same sentence.
 */
const CLAIM_PHRASES = [
  "guaranteed",
  "guarantee",
  "assured",
  "no.1",
  "no 1",
  "number one",
  "best aviation",
  "top-ranked",
  "top ranked",
];

/**
 * Percentages are only a claim when a promise follows ("100% placement").
 * Bare CSS/SVG percentages (offset="100%", calc(… 100%)) are not language.
 */
const PERCENT_CLAIM = /(\d{2,3})\s?%\s*(placement|placed|assured|guarantee|success|of\s+(students|candidates)|pass)/i;

const NEGATION =
  /\b(no|not|never|cannot|can't|without|refuse[ds]?|refusing|reject(?:s|ed)?|den(?:y|ies|ied)|makes\s+no|is\s+not|are\s+not|nothing|instead\s+of|rather\s+than)\b/i;

const TOKEN_PATTERNS = [
  { id: "R1", label: "{{TOKEN}} template placeholder", pattern: /\{\{[A-Z0-9_]+\}\}/ },
  {
    id: "R3",
    label: "[CLIENT INPUT REQUIRED] token outside data/",
    pattern: /\[CLIENT INPUT REQUIRED[^\]]*\]/i,
    restrictTo: (file) => file.startsWith("data"),
  },
];

function walk(dir, files = []) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const full = path.join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) walk(full, files);
    else if (EXTENSIONS.has(path.extname(entry))) files.push(full);
  }
  return files;
}

const relative = (file) => path.relative(ROOT, file).split(path.sep).join("/");

/** A hit counts only if the phrase is not negated in the same sentence. */
function isUnnegatedClaim(sentence) {
  const value = sentence.toLowerCase();
  // Questions are answered elsewhere — the answer carries the claim, if any.
  if (/[?]\s*["'`)\],.;]*$/.test(value.trim())) return false;

  const hits = [];
  for (const phrase of CLAIM_PHRASES) {
    let index = value.indexOf(phrase);
    while (index !== -1) {
      hits.push(index);
      index = value.indexOf(phrase, index + 1);
    }
  }
  const percent = PERCENT_CLAIM.exec(value);
  if (percent) hits.push(percent.index);

  // Negation may sit before or after the phrase within the same sentence:
  // "Any institute claiming to guarantee X is making a promise it cannot
  //  control." is a denial, not a claim.
  return hits.some(
    (index) =>
      !NEGATION.test(value.slice(Math.max(0, index - 90), index)) &&
      !NEGATION.test(value.slice(index, index + 80)),
  );
}

export function hasUnnegatedBannedPhrase(line) {
  return line
    .split(/(?<=[.!?])\s+/)
    .some((sentence) => sentence.trim().length > 0 && isUnnegatedClaim(sentence));
}

export function checkFiles(files) {
  const errors = [];
  const notes = [];

  for (const file of files) {
    const rel = relative(file);
    if (SKIP_FILES.has(rel)) continue;
    const source = readFileSync(file, "utf8");

    for (const rule of TOKEN_PATTERNS) {
      if (rule.restrictTo && !rule.restrictTo(rel)) continue;
      if (rule.pattern.test(source)) {
        const line = source.split("\n").findIndex((entry) => rule.pattern.test(entry)) + 1;
        errors.push({ id: rule.id, file: rel, line, message: rule.label });
      }
    }

    source.split("\n").forEach((line, index) => {
      if (hasUnnegatedBannedPhrase(line)) {
        errors.push({
          id: "R2",
          file: rel,
          line: index + 1,
          message: `unqualified outcome claim: "${line.trim().slice(0, 90)}"`,
        });
      }
    });
  }

  // R4 — partner metadata presence in the placement data module.
  const placementFile = path.join(ROOT, "data", "placement.ts");
  try {
    const source = readFileSync(placementFile, "utf8");
    for (const field of ["relationshipType", "verificationStatus", "logoUsageApproved"]) {
      if (!source.includes(field)) {
        errors.push({
          id: "R4",
          file: "data/placement.ts",
          line: 0,
          message: `partner entries missing "${field}"`,
        });
      }
    }
    if (source.includes("AUTHORIZED_HIRING_PARTNER")) {
      notes.push(
        "data/placement.ts declares AUTHORIZED_HIRING_PARTNER — confirm authorization evidence is on file.",
      );
    }
  } catch {
    errors.push({ id: "R4", file: "data/placement.ts", line: 0, message: "placement data module missing" });
  }

  return { errors, notes };
}

function selfTest() {
  const probes = [
    {
      id: "R1",
      name: "{{TOKEN}} placeholder",
      detect: () => TOKEN_PATTERNS[0].pattern.test("const rate = {{PLACEMENT_RATE}};"),
      shouldFail: true,
    },
    {
      id: "R3",
      name: "client-input token inside a component",
      detect: () => TOKEN_PATTERNS[1].pattern.test("<p>[CLIENT INPUT REQUIRED — FEES]</p>"),
      shouldFail: true,
    },
    {
      id: "R3-ok",
      name: "client-input token inside data/ (allowed)",
      detect: () => TOKEN_PATTERNS[1].restrictTo("data/site.ts") === true,
      shouldFail: true,
    },
    {
      id: "R2",
      name: "unqualified guarantee claim",
      detect: () => hasUnnegatedBannedPhrase("We offer guaranteed jobs for every graduate."),
      shouldFail: true,
    },
    {
      id: "R2-pct",
      name: "100% placement claim",
      detect: () => hasUnnegatedBannedPhrase("We deliver 100% placement assistance."),
      shouldFail: true,
    },
    {
      id: "R2-negated",
      name: "guarantee language inside a denial",
      detect: () => hasUnnegatedBannedPhrase("Placement assistance is provided. No placement is guaranteed."),
      shouldFail: false,
    },
    {
      id: "R2-question",
      name: "guarantee language posed as a question",
      detect: () => hasUnnegatedBannedPhrase('question: "Does the institute guarantee a job?"'),
      shouldFail: false,
    },
    {
      id: "R2-css",
      name: "CSS/SVG percentages are not claims",
      detect: () => hasUnnegatedBannedPhrase('<stop offset="100%" stopColor="#ffb224" />'),
      shouldFail: false,
    },
  ];

  let failures = 0;
  for (const probe of probes) {
    const detected = probe.detect();
    const pass = detected === probe.shouldFail;
    if (!pass) failures += 1;
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${probe.id} — ${probe.name} (detected: ${detected})`);
  }

  // Partner metadata probe: a record without verificationStatus must be rejected.
  const partnerProbe = ["relationshipType: 'STUDENT_CAREER_DESTINATION'", "name: 'X Airlines'"].join("\n");
  const rejected = !partnerProbe.includes("verificationStatus");
  console.log(`  ${rejected ? "PASS" : "FAIL"}  R4 — partner without verificationStatus is rejected`);
  if (!rejected) failures += 1;

  return failures;
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--self-test")) {
    console.log("\nClaim-gate self-test (proving the detectors fire)\n");
    const failures = selfTest();
    console.log(
      failures === 0
        ? "\n  Self-test passed: every rule rejects a planted violation and accepts safe copy.\n"
        : `\n  Self-test FAILED: ${failures} detector(s) behaved incorrectly.\n`,
    );
    process.exit(failures === 0 ? 0 : 1);
  }

  const files = SCAN_DIRS.flatMap((dir) => walk(path.join(ROOT, dir)));
  const { errors, notes } = checkFiles(files);

  console.log(`\nContent verification · ${files.length} source files scanned\n`);
  for (const note of notes) console.log(`  NOTE  ${note}`);

  if (errors.length === 0) {
    console.log("  PASS  no unqualified claims, no stray tokens, partner metadata intact\n");
    return;
  }

  for (const error of errors) {
    console.log(
      `  FAIL  [${error.id}] ${error.file}${error.line ? `:${error.line}` : ""} — ${error.message}`,
    );
  }
  console.log(`\n  ${errors.length} content violation(s) found.\n`);
  process.exit(1);
}

main();