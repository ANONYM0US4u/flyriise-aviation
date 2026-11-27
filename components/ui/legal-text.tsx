import type { ReactNode } from "react";

/**
 * Legal copy may contain `[CLIENT INPUT REQUIRED — …]` tokens where the
 * institute's own policy must be supplied. They are removed from the rendered
 * page entirely — a visitor never sees the site's own scaffolding — while the
 * token stays in the data file so the pending item is still tracked there.
 *
 * Two regexes on purpose: the splitting pattern is global (stateful `test()` on
 * a global regex would leak `lastIndex` between calls), the check is not.
 */
const TOKEN_SOURCE = "\\[CLIENT INPUT REQUIRED — [^\\]]+\\]|\\[LEGAL REVIEW REQUIRED[^\\]]*\\]";
const TOKEN_SPLIT = new RegExp(`(${TOKEN_SOURCE})`, "g");
const TOKEN_TEST = new RegExp(TOKEN_SOURCE);

export function renderLegalText(text: string): ReactNode[] {
  return text
    .split(TOKEN_SPLIT)
    .filter((part) => !TOKEN_TEST.test(part))
    .map((part, index) => <span key={index}>{part}</span>);
}

export function containsToken(text: string): boolean {
  return TOKEN_TEST.test(text);
}
