import type { ProgramScene } from "@/data/programs";
import { cn } from "@/lib/utils";

/**
 * PROGRAMME SCENES
 * ---------------------------------------------------------------------------
 * Each track gets its own vector composition in the brand's line language —
 * concourse, cabin, presence, ramp, lobby — instead of a stock photograph.
 * Deliberately abstract: no fabricated campus imagery, no airline livery.
 */

const stroke = "currentColor";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className="h-full w-full text-cirrus/70"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="scene-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12203a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#070b14" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="#0c1626" />
      <g fill="none" stroke={stroke} strokeWidth="1.15" strokeLinecap="round">
        {children}
      </g>
      <rect width="400" height="260" fill="url(#scene-fade)" />
    </svg>
  );
}

function Concourse() {
  return (
    <Frame label="Concourse scene: check-in counters, departure board and terminal glazing">
      {/* Terminal glazing */}
      <path d="M20 40H380M20 40V28M380 40V28" />
      {Array.from({ length: 9 }).map((_, index) => (
        <path key={index} d={`M${40 + index * 40} 28V86`} opacity="0.5" />
      ))}
      <path d="M20 86H380" opacity="0.7" />
      {/* Departure board */}
      <rect x="252" y="104" width="122" height="58" rx="3" />
      {Array.from({ length: 4 }).map((_, index) => (
        <path key={index} d={`M262 ${116 + index * 12}H352`} opacity={0.5 - index * 0.08} />
      ))}
      <path d="M262 110H300" stroke="#ffb224" strokeWidth="2" opacity="0.9" />
      {/* Check-in counters */}
      <path d="M20 196H180M20 196V232M180 196V232" />
      <path d="M20 214H180" opacity="0.45" />
      <path d="M52 176h28v20h-28zM112 176h28v20h-28z" />
      <path d="M60 176v-10h12v10M120 176v-10h12v10" opacity="0.6" />
      {/* Queue tape */}
      <path d="M196 150h120" opacity="0.35" strokeDasharray="6 6" />
      <path d="M196 150v46M316 150v46" opacity="0.35" />
      {/* Floor markings */}
      <path d="M188 236H380" opacity="0.25" strokeDasharray="10 8" />
    </Frame>
  );
}

function Cabin() {
  return (
    <Frame label="Cabin scene: aisle perspective with seat rows and overhead bins">
      {/* Fuselage shell */}
      <path d="M112 236C74 214 60 176 60 130C60 84 74 46 112 24" opacity="0.5" />
      <path d="M288 236C326 214 340 176 340 130C340 84 326 46 288 24" opacity="0.5" />
      {/* Overhead bins */}
      <path d="M120 46C150 30 250 30 280 46" />
      <path d="M120 66C150 52 250 52 280 66" opacity="0.5" />
      {/* Seat rows */}
      {Array.from({ length: 5 }).map((_, index) => {
        const scale = 1 + index * 0.22;
        const y = 92 + index * 28;
        const half = 42 * scale;
        return (
          <g key={index} opacity={0.85 - index * 0.08}>
            <path d={`M${200 - half} ${y} h${half * 2}`} />
            <path d={`M${200 - half} ${y} v18 M${200 + half} ${y} v18`} />
            <path d={`M${200 - 14 - index * 2} ${y + 4}v12M${200 + 14 + index * 2} ${y + 4}v12`} opacity="0.4" />
          </g>
        );
      })}
      {/* Aisle centreline */}
      <path d="M200 84V232" strokeDasharray="8 10" opacity="0.3" />
      {/* Service trolley */}
      <rect x="212" y="196" width="34" height="30" rx="2" opacity="0.8" />
      <path d="M212 208h34" opacity="0.5" />
      {/* Call indicator */}
      <circle cx="266" cy="86" r="4" fill="#ffb224" stroke="none" />
    </Frame>
  );
}

function Presence() {
  return (
    <Frame label="Presentation scene: grooming mirror, posture guide and framing marks">
      <path d="M40 236V24H200V236" opacity="0.35" />
      <path d="M40 130H200" opacity="0.2" />
      {/* Figure: shoulders and head, posture guide */}
      <path d="M120 236c-16-26-22-44-22-62 0-24 12-40 22-46" />
      <circle cx="120" cy="86" r="26" />
      <path d="M120 112c-14 6-22 18-24 34" opacity="0.6" />
      <path d="M88 236c0-34 12-58 32-66 20 8 32 32 32 66" opacity="0.85" />
      {/* Framing marks */}
      <path d="M64 56h-14v-14M176 56h14v-14M64 196h-14v14" opacity="0.5" />
      <path d="M252 40h108v108H252z" opacity="0.35" />
      <path d="M252 76h108M252 112h108" opacity="0.2" />
      <path d="M276 40v108M336 40v108" opacity="0.2" />
      {/* Grooming checklist */}
      {Array.from({ length: 4 }).map((_, index) => (
        <g key={index} opacity="0.6">
          <rect x="266" y={164 + index * 16} width="7" height="7" rx="1" />
          <path d={`M282 ${168 + index * 16}H344`} />
        </g>
      ))}
      <path d="M266 164l3 3 5-6" stroke="#ffb224" strokeWidth="2" />
    </Frame>
  );
}

function Ramp() {
  return (
    <Frame label="Ramp scene: apron markings, baggage loader and aircraft nose">
      {/* Aircraft nose profile */}
      <path d="M16 96C64 84 128 80 176 84c30 3 46 12 54 24" opacity="0.9" />
      <path d="M16 172C70 180 132 182 186 176" opacity="0.7" />
      <path d="M230 108c-8 22-30 34-52 34" opacity="0.5" />
      <path d="M204 88c14 6 24 14 28 22" opacity="0.4" />
      {/* Ground equipment */}
      <rect x="248" y="164" width="62" height="34" rx="2" />
      <path d="M248 178h62M272 164v-16" opacity="0.6" />
      <circle cx="266" cy="204" r="7" />
      <circle cx="296" cy="204" r="7" />
      <path d="M206 152l34-28" opacity="0.45" strokeDasharray="5 6" />
      {/* Cones */}
      {[228, 262, 296].map((x) => (
        <g key={x} opacity="0.7">
          <path d={`M${x} 226l6-16 6 16z`} />
          <path d={`M${x - 3} 226h18`} />
        </g>
      ))}
      {/* Apron markings */}
      <path d="M310 236h74" strokeDasharray="12 10" opacity="0.4" />
      <path d="M330 88h56v40h-56z" opacity="0.3" />
    </Frame>
  );
}

function Lobby() {
  return (
    <Frame label="Hospitality scene: front desk, pendant lighting and guest seating">
      {/* Ceiling and pendants */}
      <path d="M20 34H380" opacity="0.5" />
      {[92, 200, 308].map((x, index) => (
        <g key={x} opacity={0.85 - index * 0.1}>
          <path d={`M${x} 34v34`} />
          <path d={`M${x - 14} 68h28l-6 12h-16z`} />
          <circle cx={x} cy={90} r="5" fill="#ffb224" stroke="none" opacity="0.7" />
        </g>
      ))}
      {/* Front desk */}
      <path d="M60 236V168h140v68" />
      <path d="M60 186h140" opacity="0.5" />
      <path d="M92 168V150h76v18" opacity="0.7" />
      {/* Seating */}
      <path d="M244 236v-40h78v40" />
      <path d="M244 212h78" opacity="0.5" />
      <path d="M256 196h56" opacity="0.4" />
      <path d="M262 236v-22M304 236v-22" opacity="0.4" />
      {/* Plant */}
      <path d="M348 236v-30" />
      <path d="M348 214c-12-4-18-14-16-24 12 2 18 12 16 24zM348 218c12-4 18-14 16-24-12 2-18 12-16 24z" opacity="0.6" />
      {/* Floor */}
      <path d="M20 236H380" strokeDasharray="16 10" opacity="0.3" />
    </Frame>
  );
}

const SCENES: Record<ProgramScene, () => React.ReactElement> = {
  concourse: Concourse,
  cabin: Cabin,
  presence: Presence,
  ramp: Ramp,
  lobby: Lobby,
};

export function ProgramSceneGraphic({
  scene,
  className,
}: {
  scene: ProgramScene;
  className?: string;
}) {
  const Scene = SCENES[scene];
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--radius-md)] border border-hairline", className)}>
      <Scene />
      <div aria-hidden className="absolute inset-0 grain" />
    </div>
  );
}
