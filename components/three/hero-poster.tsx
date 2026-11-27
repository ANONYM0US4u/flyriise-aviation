import { cn } from "@/lib/utils";

/**
 * TIER C POSTER (brief §07A)
 * ---------------------------------------------------------------------------
 * A complete static visual for low-power devices, reduced-motion visitors,
 * no-WebGL browsers, Save-Data sessions and context loss. Drawn in the site's
 * own visual language — no stock photography — so the hero reads as intentional
 * rather than as a degraded scene.
 *
 * It also sits beneath the WebGL canvas at every tier, which means the first
 * paint never waits for a shader to compile.
 */

/** Runway edge lights, parameterised by depth so perspective stays consistent. */
const EDGE_LIGHTS = Array.from({ length: 16 }, (_, index) => {
  const depth = index / 15;
  const y = 566 + depth * depth * 334;
  const spread = 14 + depth * 420;
  const radius = 1.4 + depth * 5.4;
  const opacity = 0.32 + depth * 0.6;
  return { y, leftX: 1080 - spread, rightX: 1080 + spread, radius, opacity, key: index };
});

const CENTRELINE = Array.from({ length: 11 }, (_, index) => {
  const depth = (index + 1) / 12;
  const y = 572 + depth * depth * 300;
  const width = 1 + depth * 5;
  const height = 4 + depth * 44;
  return { y, width, height, opacity: 0.2 + depth * 0.5, key: index };
});

const STARS = [
  [180, 90, 1.4, 0.5],
  [320, 150, 1.1, 0.35],
  [520, 70, 1.6, 0.55],
  [700, 130, 1.1, 0.3],
  [880, 62, 1.3, 0.45],
  [1010, 168, 1.2, 0.32],
  [1180, 96, 1.5, 0.5],
  [1320, 190, 1.1, 0.28],
  [1460, 78, 1.4, 0.42],
  [240, 232, 1, 0.22],
  [620, 214, 1.2, 0.3],
  [940, 246, 1, 0.2],
  [1120, 300, 1.1, 0.24],
  [1420, 288, 1, 0.2],
] as const;

export function HeroPoster({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="presentation"
      >
        <defs>
          <linearGradient id="poster-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04060d" />
            <stop offset="42%" stopColor="#0a1322" />
            <stop offset="72%" stopColor="#1a2436" />
            <stop offset="100%" stopColor="#392b25" />
          </linearGradient>
          <radialGradient id="poster-horizon" cx="0.66" cy="1" r="0.62">
            <stop offset="0%" stopColor="#ffb224" stopOpacity="0.5" />
            <stop offset="42%" stopColor="#c9741f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c9741f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="poster-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111823" />
            <stop offset="100%" stopColor="#05070c" />
          </linearGradient>
          <linearGradient id="poster-runway" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1017" />
            <stop offset="100%" stopColor="#1a2230" />
          </linearGradient>
          <radialGradient id="poster-apron-light" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffb224" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#ffb224" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="poster-vignette" cx="0.5" cy="0.45" r="0.78">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.62" />
          </radialGradient>
          <filter id="poster-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="poster-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1600" height="900" fill="url(#poster-sky)" />

        {/* Stars */}
        {STARS.map(([cx, cy, r, opacity]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#dce8f7" opacity={opacity} />
        ))}

        {/* Horizon glow and fog banks */}
        <rect x="0" y="380" width="1600" height="260" fill="url(#poster-horizon)" />
        <ellipse cx="1080" cy="556" rx="360" ry="42" fill="#c9884a" opacity="0.2" filter="url(#poster-blur)" />
        <ellipse cx="520" cy="536" rx="300" ry="30" fill="#8fa5c4" opacity="0.12" filter="url(#poster-blur)" />

        {/* Ground plane */}
        <rect x="0" y="556" width="1600" height="344" fill="url(#poster-ground)" />

        {/* Runway with perspective edges */}
        <path d="M1042 556 L1298 900 L742 900 L1042 556 Z" fill="url(#poster-runway)" opacity="0.95" />
        {EDGE_LIGHTS.map((light) => (
          <g key={light.key}>
            <circle cx={light.leftX} cy={light.y} r={light.radius} fill="#ffd9a0" opacity={light.opacity} />
            <circle cx={light.rightX} cy={light.y} r={light.radius} fill="#ffd9a0" opacity={light.opacity} />
            <circle
              cx={light.leftX}
              cy={light.y}
              r={light.radius * 4}
              fill="#ffb224"
              opacity={light.opacity * 0.22}
              filter="url(#poster-soft)"
            />
            <circle
              cx={light.rightX}
              cy={light.y}
              r={light.radius * 4}
              fill="#ffb224"
              opacity={light.opacity * 0.22}
              filter="url(#poster-soft)"
            />
          </g>
        ))}
        {CENTRELINE.map((dash) => (
          <rect
            key={dash.key}
            x={1080 - dash.width / 2}
            y={dash.y}
            width={dash.width}
            height={dash.height}
            fill="#e6edf6"
            opacity={dash.opacity}
          />
        ))}

        {/* Apron floodlight pool */}
        <ellipse cx="560" cy="700" rx="420" ry="150" fill="url(#poster-apron-light)" />

        {/* Taxiway guide */}
        <path
          d="M60 880 Q 300 830 420 748 T 640 700"
          fill="none"
          stroke="#ffb224"
          strokeWidth="2.5"
          opacity="0.42"
        />
        <path
          d="M60 880 Q 300 830 420 748 T 640 700"
          fill="none"
          stroke="#ffb224"
          strokeWidth="12"
          opacity="0.12"
          filter="url(#poster-soft)"
        />

        {/* Contact shadow */}
        <ellipse cx="700" cy="640" rx="290" ry="20" fill="#000000" opacity="0.55" filter="url(#poster-blur)" />

        {/* Aircraft silhouette — unbranded, side profile */}
        <g fill="#070a10">
          {/* Horizontal stabiliser */}
          <path d="M520 558 L404 592 L372 592 L432 556 Z" />
          {/* Vertical fin */}
          <path d="M528 502 L458 392 Q 448 380 466 380 L506 380 L552 502 Z" />
          {/* Far wing */}
          <path d="M840 552 L596 620 L548 620 L772 550 Z" opacity="0.82" />
          {/* Fuselage */}
          <path d="M1010 528 C 980 510 932 502 880 502 L470 502 C 420 502 372 512 344 528 C 372 546 420 556 470 558 L880 558 C 932 556 980 546 1010 528 Z" />
          {/* Nacelle and pylon */}
          <ellipse cx="706" cy="588" rx="76" ry="28" />
          <path d="M668 556 L716 556 L734 572 L676 572 Z" />
          {/* Winglet */}
          <path d="M596 620 L574 590 L590 588 L610 616 Z" />
          {/* Landing gear */}
          <rect x="878" y="556" width="12" height="52" />
          <rect x="560" y="556" width="13" height="54" />
          <rect x="498" y="556" width="12" height="50" />
          <circle cx="884" cy="616" r="11" />
          <circle cx="566" cy="618" r="12" />
          <circle cx="504" cy="614" r="11" />
        </g>

        {/* Cockpit glass and exhaust glow */}
        <path d="M902 504 C 934 508 966 518 986 528 L900 528 Z" fill="#0d1420" />
        <ellipse cx="782" cy="588" rx="42" ry="16" fill="#ff9a3c" opacity="0.34" filter="url(#poster-soft)" />

        {/* Vignette + grain */}
        <rect width="1600" height="900" fill="url(#poster-vignette)" />
      </svg>
      <div className="absolute inset-0 grain" />
    </div>
  );
}
