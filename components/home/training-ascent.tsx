import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader, SectionMeta } from "@/components/ui/section";
import { trainingIntro, trainingStations } from "@/data/training";

/**
 * SECTION 4 — The training experience (brief §10 section 4).
 * The climb from ground school to interview room drawn as an altitude profile:
 * seven stations, each with the skill it builds. The section itself grades from
 * blue hour into first light — the page's transition into the light sections.
 */
export function TrainingAscent() {
  const width = 1000;
  const height = 320;
  const padding = { x: 60, y: 40 };

  const points = trainingStations.map((_, index) => {
    const t = index / (trainingStations.length - 1);
    const x = padding.x + t * (width - padding.x * 2);
    const y = height - padding.y - t * (height - padding.y * 2.1);
    return { x, y };
  });

  const path = points
    .map((point, index) => (index === 0 ? `M${point.x} ${point.y}` : `L${point.x} ${point.y}`))
    .join(" ");

  return (
    <Section
      tone="light"
      id="training"
      labeledBy="training-heading"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* The climb out of blue hour into first light */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-twilight to-transparent"
      />
      <div className="container-wide relative">
        <SectionMeta code="SEC 04" label="Training experience" marker="FIRST LIGHT" />

        <SectionHeader
          level={2}
          id="training-heading"
          eyebrow={trainingIntro.eyebrow}
          heading={trainingIntro.heading}
          body={<p>{trainingIntro.body}</p>}
          tone="light"
          className="mt-10"
        />

        {/* Altitude profile */}
        <Reveal className="mt-14">
          <div className="rounded-[var(--radius-md)] border border-hairline-light bg-cloud p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="mono-label text-graphite">Ascent profile · ground school → interview room</p>
              <p className="mono-label text-graphite">7 stations · assessed modules</p>
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="mt-4 h-48 w-full sm:h-64"
              role="img"
              aria-label="Altitude profile showing the seven training stations from grooming to scenario drills"
            >
              <defs>
                <linearGradient id="ascent-line" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#46536b" />
                  <stop offset="70%" stopColor="#0a1222" />
                  <stop offset="100%" stopColor="#ffb224" />
                </linearGradient>
                <linearGradient id="ascent-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb224" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#ffb224" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Altitude grid */}
              {[0, 1, 2, 3, 4].map((line) => {
                const y = padding.y + line * ((height - padding.y * 2) / 4);
                return (
                  <line
                    key={line}
                    x1={padding.x}
                    x2={width - padding.x}
                    y1={y}
                    y2={y}
                    stroke="#0a1222"
                    strokeOpacity="0.12"
                    strokeDasharray="4 8"
                  />
                );
              })}

              <path d={`${path} L${points[points.length - 1]!.x} ${height - padding.y} L${points[0]!.x} ${height - padding.y} Z`} fill="url(#ascent-fill)" />
              <path
                d={path}
                fill="none"
                stroke="url(#ascent-line)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="draw-path"
              />

              {points.map((point, index) => {
                const station = trainingStations[index]!;
                return (
                  <g key={station.code}>
                    <circle cx={point.x} cy={point.y} r="6" fill="#F7F9FC" stroke="#0A1222" strokeWidth="2" />
                    <circle cx={point.x} cy={point.y} r="2.4" fill="#ffb224" />
                    <text
                      x={point.x}
                      y={point.y - 18}
                      textAnchor="middle"
                      className="mono-label"
                      fill="#46536b"
                      fontSize="11"
                      letterSpacing="1.6"
                    >
                      {station.marker}
                    </text>
                    <text
                      x={point.x}
                      y={height - 14}
                      textAnchor="middle"
                      fill="#0a1222"
                      fontSize="12"
                      letterSpacing="0.4"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Reveal>

        {/* Station detail */}
        <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {trainingStations.map((station, index) => (
            <Reveal as="li" key={station.code} delay={index * 60}>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline-light pb-3">
                <span className="mono-label text-ink">
                  {station.code} · {station.marker}
                </span>
                <span className="mono-label text-graphite">{station.skill}</span>
              </div>
              <h3 className="display mt-4 text-[1.125rem] text-ink">{station.title}</h3>
              <p className="measure-tight mt-2 text-[0.9375rem] leading-[1.65] text-graphite">
                {station.detail}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
