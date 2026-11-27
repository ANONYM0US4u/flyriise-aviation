/** Small shared helpers. No dependency required for any of these. */

/**
 * Class-name joiner that behaves like `tailwind-merge` for the properties where
 * overrides actually happen in this codebase: `display` and `color`.
 *
 * Without this, a component's base `inline-flex` silently beats a caller's
 * `hidden`, and a base `text-steel-deep` silently beats a caller's
 * `text-graphite` — CSS source order decides, not the order in the class
 * attribute, so overrides were being dropped. Both cases were caught in QA
 * (see docs/QA_REPORT.md, A11Y-1 / LAYOUT-1).
 */
const DISPLAY_CLASS = /^(?:inline-)?(?:flex|grid|block|hidden|contents|flow-root|table|list-item|inline-table)$/;

/** Tailwind's built-in sizes plus this project's custom type scale. */
const TEXT_SIZE = /^(?:xs|sm|base|lg|xl|[2-9]xl|eyebrow|display-[123]|stat)$/;
/** Arbitrary sizes: `text-[0.98rem]`, `text-[13px]`, `text-[4ch]`. */
const SIZE_UNIT = /(?:rem|em|px|ch|ex|vw|vh|vmin|vmax|cqw|cqi)$/i;
/** `text-` utilities that set alignment/wrap/decoration rather than colour. */
const TEXT_NON_COLOUR =
  /^(?:left|right|center|justify|start|end|match|wrap|nowrap|balance|pretty|ellipsis|clip|indent|underline|overline|line-through|no-underline)$/;

function isTextColour(className: string): boolean {
  if (!className.startsWith("text-")) return false;
  // `text-cirrus/85` → `cirrus`, `text-[0.98rem]` → `0.98rem`
  let value = className.slice(5);
  const slash = value.indexOf("/");
  if (slash !== -1) value = value.slice(0, slash);
  if (value.startsWith("[") && value.endsWith("]")) value = value.slice(1, -1);
  if (!value || TEXT_SIZE.test(value) || SIZE_UNIT.test(value)) return false;
  return !TEXT_NON_COLOUR.test(value);
}

/** The CSS property two classes would both set — they conflict, later wins. */
function conflictKey(className: string): "display" | "color" | null {
  if (DISPLAY_CLASS.test(className)) return "display";
  if (isTextColour(className)) return "color";
  return null;
}

export function cn(...values: Array<string | false | null | undefined>): string {
  const classes = values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/\s+/))
    .filter(Boolean);

  const kept: string[] = [];
  const seen = new Set<string>();

  for (let index = classes.length - 1; index >= 0; index -= 1) {
    const className = classes[index]!;
    // Responsive variants (md:hidden, hover:text-cirrus) are left alone — they
    // only apply inside their own media/state query and must not suppress the
    // base declaration.
    if (!className.includes(":")) {
      const key = conflictKey(className);
      if (key) {
        if (seen.has(key)) continue;
        seen.add(key);
      }
    }
    kept.unshift(className);
  }

  return kept.join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** "2026-02-14" → "14 Feb 2026" (deterministic, no locale drift across SSR). */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthLabel = MONTHS[Number(month) - 1];
  if (!year || !monthLabel || !day) return iso;
  return `${Number(day)} ${monthLabel} ${year}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Digits only, for tel:/wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function gridColumns(count: number, max = 12): number {
  return Math.max(1, Math.min(count, max));
}
