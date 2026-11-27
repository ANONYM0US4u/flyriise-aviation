import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Icon set — engineered line work, 1.5px strokes, 24px grid. Deliberately
 * small: aviation symbols are used sparingly (brief §01 "overuse of aircraft
 * icons" is an anti-pattern).
 */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className, ...props }: IconProps & { children: React.ReactNode }) {
  /*
   * A caller's className used to replace the base class entirely (it was spread
   * after `className`), which left the SVG at the 300x150 default — giant
   * contact icons in the footer and CTA card. Size only falls back to 1.05em
   * when the caller has not supplied its own height/width utility.
   */
  const callerSetsSize = typeof className === "string" && /(?:^|\s)[hw]-/.test(className);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", callerSetsSize ? undefined : "h-[1.05em] w-[1.05em]", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowUpRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Icon>
);

export const Phone = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 4.5h4l1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5v4a1.5 1.5 0 01-1.7 1.5A16.5 16.5 0 013 6.2 1.5 1.5 0 014.5 4.5z" />
  </Icon>
);

export const WhatsApp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 11.6a8.4 8.4 0 01-12.3 7.5L3.5 20.5l1.5-4.1A8.4 8.4 0 1120 11.6z" />
    <path d="M8.8 8.6c0 3 2.6 5.6 5.6 5.6.6 0 1.2-.4 1.2-1l-.2-.9-1.5-.5-.8.9a4.3 4.3 0 01-2.2-2.2l.9-.8-.5-1.5-.9-.2c-.6 0-1.6.1-1.6 1.6z" />
  </Icon>
);

export const Mail = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </Icon>
);

export const Pin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s6.5-5.4 6.5-10a6.5 6.5 0 10-13 0C5.5 15.6 12 21 12 21z" />
    <circle cx="12" cy="10.8" r="2.4" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const Menu = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const Clock = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3.2 2" />
  </Icon>
);

export const Layers = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.5l8 4.2-8 4.3-8-4.3 8-4.2z" />
    <path d="M4 12.2l8 4.3 8-4.3" />
    <path d="M4 16.4l8 4.2 8-4.2" />
  </Icon>
);

export const Alert = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.8v5" />
    <path d="M12 16.1h.01" />
  </Icon>
);
